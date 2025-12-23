import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { llm } from "../_core/llm";
import { logger } from "../_core/logger";
import { AIServiceError, RateLimitError } from "../_core/errors";

// Rate limiting por IP
const ipRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = ipRateLimit.get(ip);
  
  if (!limit || now > limit.resetAt) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1h
    return true;
  }
  
  if (limit.count >= 10) { // 10 diagnósticos por hora
    return false;
  }
  
  limit.count++;
  return true;
}

export const diagnosticoRouter = router({
  // Gerar diagnóstico personalizado com IA
  gerarDiagnostico: publicProcedure
    .input(
      z.object({
        scoreBio: z.number().min(0).max(12),
        scoreConsciencia: z.number().min(0).max(12),
        scoreFinanceiro: z.number().min(0).max(12),
        nivelBio: z.string(),
        nivelConsciencia: z.string(),
        nivelFinanceiro: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limiting
      const clientIp = ctx.req.ip || ctx.req.socket.remoteAddress || 'unknown';
      if (!checkRateLimit(clientIp)) {
        throw new RateLimitError(
          'Limite de diagnósticos atingido. Aguarde 1 hora para continuar.'
        );
      }

      const totalScore = input.scoreBio + input.scoreConsciencia + input.scoreFinanceiro;

      // PROMPT OURO - Diagnóstico Textual Personalizado
      const prompt = `Você é uma especialista em marketing estético, neurovendas e posicionamento premium.

Gere um diagnóstico claro, direto e respeitoso para uma dona de clínica estética com base nestes resultados:

- Nível de Bio: ${input.nivelBio} (${input.scoreBio}/12 pontos)
- Nível de Consciência das Clientes: ${input.nivelConsciencia} (${input.scoreConsciencia}/12 pontos)
- Nível de Gestão Financeira: ${input.nivelFinanceiro} (${input.scoreFinanceiro}/12 pontos)
- Pontuação Total: ${totalScore}/36 pontos

Explique:
1. O que está travando os agendamentos
2. O impacto disso no faturamento
3. O que precisa ser ajustado (sem entregar tudo)
4. Um convite sutil para aprofundar no diagnóstico estratégico com o Elevare

Tom:
- Profissional
- Elegante
- Nada agressivo
- Nada genérico
- Linguagem de estética e autoridade

Evite termos técnicos de marketing.

Estruture assim:
**Visão Geral** (2-3 frases)
**O que está travando seus agendamentos** (seja específica)
**O impacto no faturamento** (real, mas não alarmista)
**Prioridade de correção** (o que atacar primeiro)
**Próximo passo** (convite sutil para o Elevare)

Máximo 350 palavras. Direto ao ponto. Sem introduções genéricas tipo "Olá" ou "Parabéns por fazer o diagnóstico".`;

      try {
        const response = await llm.chat.completions.create({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "Você é uma especialista em marketing estético, neurovendas e posicionamento premium para clínicas de estética. Responda em texto corrido formatado com markdown, usando **negrito** para títulos de seções.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content;
        
        if (!content) {
          logger.error('IA retornou resposta vazia', { response });
          throw new AIServiceError(
            'O serviço de IA não retornou uma resposta válida. Tente novamente.'
          );
        }

        const contentStr = typeof content === 'string' ? content : String(content);

        logger.info('Diagnóstico Elevare gerado', { 
          totalScore,
          nivelBio: input.nivelBio,
          nivelConsciencia: input.nivelConsciencia,
          nivelFinanceiro: input.nivelFinanceiro,
        });

        return {
          diagnostico: contentStr,
          totalScore,
        };
      } catch (error) {
        logger.error('Erro ao gerar diagnóstico', { error, input });
        
        if (error instanceof AIServiceError || error instanceof RateLimitError) {
          throw error;
        }
        
        throw new AIServiceError(
          'Não foi possível gerar o diagnóstico. Por favor, tente novamente em alguns instantes.'
        );
      }
    }),
});
