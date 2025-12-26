import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { bioRadarDiagnosis } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { llm } from "../_core/llm";
import { logger } from "../_core/logger";
import { AIServiceError, RateLimitError, AuthorizationError } from "../_core/errors";
import { safeParse, assertOwnership } from "../../shared/_core/utils";
import { consumeCredits, checkCredits } from "../_core/credits";
import { checkFreeBioRadarLimit } from "../_core/rateLimiter";

// 🔴 Rate limiting por IP para análises gratuitas
// Agora centralizado em _core/rateLimiter.ts

export const bioRadarRouter = router({
  // Analisar bio do Instagram
  analyze: publicProcedure
    .input(
      z.object({
        instagramHandle: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      
      // BUG-004: Rate limiting para usuários não autenticados
      const clientIp = ctx.req.ip || ctx.req.socket.remoteAddress || 'unknown';
      if (!ctx.user && !checkFreeBioRadarLimit(clientIp)) {
        throw new RateLimitError(
          'Limite de análises gratuitas atingido. Faça login ou aguarde 1 hora para continuar.'
        );
      }

      // Prompt para análise da bio
      const prompt = `Você é um especialista em marketing digital para clínicas de estética. 
Analise a seguinte bio do Instagram: @${input.instagramHandle}

Como não temos acesso direto à bio, simule uma análise profissional baseada em boas práticas de marketing para estética.

Forneça a análise no seguinte formato JSON:
{
  "score": <número de 0 a 100>,
  "strengths": [<lista de 2-4 pontos fortes>],
  "weaknesses": [<lista de 2-4 pontos fracos>],
  "recommendations": [<lista de 3-5 recomendações específicas>],
  "nextSteps": "<texto com próximos passos recomendados>"
}

Seja específico e prático nas recomendações. Foque em conversão e vendas.`;

      try {
        const response = await llm.chat.completions.create({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em marketing digital para clínicas de estética. Responda sempre em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        
        // BUG-008: Validação robusta da resposta da IA
        if (!content) {
          logger.error('IA retornou resposta vazia', { response });
          throw new AIServiceError(
            'O serviço de IA não retornou uma resposta válida. Tente novamente em alguns instantes.'
          );
        }

        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        let analysis;
        
        try {
          analysis = JSON.parse(contentStr);
        } catch (parseError) {
          logger.error('Erro ao parsear resposta da IA', { content: contentStr, parseError });
          throw new AIServiceError('Resposta da IA está em formato incorreto.');
        }
        
        // Validar estrutura esperada
        if (!analysis.score || !analysis.recommendations) {
          logger.error('IA retornou estrutura inválida', { analysis });
          throw new AIServiceError('Resposta da IA está incompleta.');
        }

        // Salvar diagnóstico no banco
        const [savedDiagnosis] = await db
          .insert(bioRadarDiagnosis)
          .values({
            userId: userId || null,
            instagramHandle: input.instagramHandle,
            bioAnalysis: JSON.stringify(analysis),
            recommendations: JSON.stringify(analysis.recommendations),
            score: analysis.score,
          })
          .$returningId();

        // 💳 Consumir créditos após análise bem-sucedida (apenas para usuários autenticados)
        if (userId) {
          await consumeCredits(userId, 'bio_analysis', `Análise: @${input.instagramHandle}`);
        }

        logger.info('Bio analysis completed', { 
          diagnosisId: savedDiagnosis.id, 
          instagramHandle: input.instagramHandle,
          userId 
        });

        return {
          diagnosisId: savedDiagnosis.id,
          ...analysis,
        };
      } catch (error) {
        // BUG-008: Tratamento de erros apropriado
        if (error instanceof AIServiceError || error instanceof RateLimitError) {
          throw error;
        }
        
        logger.error('Erro ao analisar bio', {
          error: error instanceof Error ? error.message : String(error),
          instagramHandle: input.instagramHandle,
          userId,
        });
        
        throw new AIServiceError(
          'Não foi possível completar a análise. Por favor, tente novamente.',
          error
        );
      }
    }),

  // Salvar lead (email/WhatsApp)
  saveLead: publicProcedure
    .input(
      z.object({
        diagnosisId: z.number(),
        email: z.string().email().optional(),
        whatsapp: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!input.email && !input.whatsapp) {
        throw new Error("Forneça pelo menos email ou WhatsApp");
      }

      await db
        .update(bioRadarDiagnosis)
        .set({
          leadEmail: input.email || null,
          leadWhatsapp: input.whatsapp || null,
        })
        .where(eq(bioRadarDiagnosis.id, input.diagnosisId));

      logger.info('Lead captured', { diagnosisId: input.diagnosisId });

      return {
        success: true,
        message: "Lead capturado com sucesso!",
      };
    }),

  // Obter diagnóstico
  getDiagnosis: protectedProcedure
    .input(
      z.object({
        diagnosisId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [diagnosis] = await db
        .select()
        .from(bioRadarDiagnosis)
        .where(eq(bioRadarDiagnosis.id, input.diagnosisId))
        .limit(1);

      if (!diagnosis) {
        throw new Error("Diagnóstico não encontrado");
      }

      // BUG-011: Usar função utilitária para verificação de ownership
      assertOwnership(diagnosis, ctx.user.id, "Você não tem permissão para acessar este diagnóstico");

      return {
        ...diagnosis,
        // BUG-011: Usar safeParse
        bioAnalysis: safeParse(diagnosis.bioAnalysis),
        recommendations: safeParse(diagnosis.recommendations),
      };
    }),

  // Listar diagnósticos do usuário
  listDiagnoses: protectedProcedure.query(async ({ ctx }) => {
    const diagnoses = await db
      .select()
      .from(bioRadarDiagnosis)
      .where(eq(bioRadarDiagnosis.userId, ctx.user.id))
      .orderBy(bioRadarDiagnosis.createdAt);

    // BUG-011: Usar safeParse
    return diagnoses.map((d: typeof diagnoses[0]) => ({
      ...d,
      bioAnalysis: safeParse(d.bioAnalysis),
      recommendations: safeParse(d.recommendations),
    }));
  }),
});
