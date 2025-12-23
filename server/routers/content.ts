import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { contentGeneration } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { llm } from "../_core/llm";
import { imageGeneration } from "../_core/imageGeneration";
import { logger } from "../_core/logger";
import { AIServiceError, NotFoundError } from "../_core/errors";
import { safeParse } from "../../shared/_core/utils";

export const contentRouter = router({
  // ============================================
  // GERADOR DE CONTEÚDO GENÉRICO
  // Usado por VeoCinema e AdsManager
  // ============================================
  generateContent: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        prompt: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await llm.chat.completions.create({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "Você é um especialista em marketing e conteúdo para clínicas de estética. Responda de forma detalhada e profissional.",
            },
            {
              role: "user",
              content: input.prompt,
            },
          ],
          temperature: 0.8,
        });

        const content = response.choices[0]?.message?.content;
        
        if (!content) {
          logger.error('IA retornou resposta vazia ao gerar conteúdo genérico');
          throw new AIServiceError('Não foi possível gerar conteúdo. Tente novamente.');
        }

        // Salvar no banco
        const [saved] = await db
          .insert(contentGeneration)
          .values({
            userId: ctx.user.id,
            type: input.type,
            title: `${input.type}: ${new Date().toISOString()}`,
            content: String(content),
            metadata: JSON.stringify({ generatedAt: new Date().toISOString() }),
            creditsUsed: 2,
          })
          .$returningId();

        logger.info('Generic content generated', { 
          type: input.type, 
          userId: ctx.user.id 
        });

        return {
          id: saved.id,
          content: String(content),
        };
      } catch (error) {
        if (error instanceof AIServiceError) {
          throw error;
        }
        
        logger.error('Erro ao gerar conteúdo genérico', {
          error: error instanceof Error ? error.message : String(error),
          userId: ctx.user.id,
          type: input.type,
        });
        
        throw new AIServiceError('Erro ao gerar conteúdo. Tente novamente.', error);
      }
    }),

  // Gerar e-book
  generateEbook: protectedProcedure
    .input(
      z.object({
        topic: z.string().min(3),
        targetAudience: z.string().optional(),
        tone: z.enum(["professional", "casual", "friendly"]).default("professional"),
        chapters: z.number().min(3).max(10).default(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = `Você é um especialista em marketing de conteúdo para clínicas de estética.

Crie um e-book completo sobre: "${input.topic}"

Público-alvo: ${input.targetAudience || "Profissionais de estética e donos de clínicas"}
Tom: ${input.tone}
Número de capítulos: ${input.chapters}

Forneça o conteúdo no seguinte formato JSON:
{
  "title": "<título do e-book>",
  "subtitle": "<subtítulo>",
  "description": "<descrição breve>",
  "coverPrompt": "<prompt para gerar capa com IA>",
  "chapters": [
    {
      "number": 1,
      "title": "<título do capítulo>",
      "content": "<conteúdo em markdown, mínimo 300 palavras>"
    }
  ],
  "conclusion": "<conclusão do e-book>",
  "callToAction": "<CTA final>"
}

Seja detalhado e prático. Cada capítulo deve ter conteúdo rico e acionável.`;

      try {
        const response = await llm.chat.completions.create({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em criar conteúdo educacional para estética. Responda sempre em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.8,
        });

        const content = response.choices[0]?.message?.content;
        
        // BUG-008: Validação robusta
        if (!content) {
          logger.error('IA retornou resposta vazia ao gerar e-book', { input });
          throw new AIServiceError('Não foi possível gerar conteúdo no momento. Tente novamente.');
        }

        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        let ebook;
        
        try {
          ebook = JSON.parse(contentStr);
        } catch (parseError) {
          logger.error('Erro ao parsear resposta da IA (ebook)', { content: contentStr, parseError });
          throw new AIServiceError('Resposta da IA está em formato incorreto.');
        }
        
        // Validar estrutura
        if (!ebook.title || !ebook.chapters) {
          logger.error('IA retornou estrutura inválida para e-book', { ebook });
          throw new AIServiceError('Resposta da IA está incompleta.');
        }

        // Salvar no banco
        const [saved] = await db
          .insert(contentGeneration)
          .values({
            userId: ctx.user.id,
            type: "ebook",
            title: ebook.title,
            content: JSON.stringify(ebook),
            metadata: JSON.stringify({
              topic: input.topic,
              chapters: input.chapters,
              tone: input.tone,
            }),
            creditsUsed: 5, // E-book custa 5 créditos
          })
          .$returningId();

        logger.info('E-book generated successfully', { 
          ebookId: saved.id, 
          userId: ctx.user.id,
          topic: input.topic 
        });

        return {
          id: saved.id,
          ...ebook,
        };
      } catch (error) {
        if (error instanceof AIServiceError) {
          throw error;
        }
        
        logger.error('Erro ao gerar e-book', {
          error: error instanceof Error ? error.message : String(error),
          userId: ctx.user.id,
          input,
        });
        
        throw new AIServiceError('Não foi possível gerar o e-book. Tente novamente.', error);
      }
    }),

  // Gerar capa de e-book
  generateCover: protectedProcedure
    .input(
      z.object({
        ebookId: z.number(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const imageUrl = await imageGeneration.generate({
          prompt: input.prompt,
          size: "1024x1024",
          quality: "standard",
        });

        // Atualizar metadata do e-book com URL da capa
        const [ebook] = await db
          .select()
          .from(contentGeneration)
          .where(
            and(
              eq(contentGeneration.id, input.ebookId),
              eq(contentGeneration.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (!ebook) {
          throw new NotFoundError("E-book não encontrado");
        }

        const metadata = safeParse(ebook.metadata) || {};
        metadata.coverUrl = imageUrl;

        await db
          .update(contentGeneration)
          .set({
            metadata: JSON.stringify(metadata),
          })
          .where(eq(contentGeneration.id, input.ebookId));

        logger.info('Cover generated for ebook', { ebookId: input.ebookId });

        return {
          success: true,
          coverUrl: imageUrl,
        };
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        
        logger.error('Erro ao gerar capa', {
          error: error instanceof Error ? error.message : String(error),
          ebookId: input.ebookId,
        });
        
        throw new AIServiceError('Erro ao gerar capa. Tente novamente.', error);
      }
    }),

  // Gerar prompt para imagens
  generatePrompt: protectedProcedure
    .input(
      z.object({
        description: z.string().min(5),
        style: z
          .enum([
            "realistic",
            "artistic",
            "minimalist",
            "professional",
            "creative",
          ])
          .default("professional"),
        platform: z.enum(["midjourney", "dalle", "stable-diffusion"]).default("dalle"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = `Você é um especialista em criar prompts para geração de imagens com IA.

Crie um prompt otimizado para ${input.platform} baseado em:
Descrição: ${input.description}
Estilo: ${input.style}

O prompt deve ser:
- Detalhado e específico
- Otimizado para ${input.platform}
- Focado em marketing para estética
- Em inglês (melhor performance)

Forneça no formato JSON:
{
  "prompt": "<prompt otimizado>",
  "negativePrompt": "<coisas a evitar>",
  "suggestions": [<3-5 variações do prompt>],
  "tips": "<dicas para melhor resultado>"
}`;

      try {
        const response = await llm.chat.completions.create({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em criar prompts para IA de imagens. Responda sempre em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.9,
        });

        const content = response.choices[0]?.message?.content;
        
        if (!content) {
          logger.error('IA retornou resposta vazia ao gerar prompt');
          throw new AIServiceError('Não foi possível gerar o prompt. Tente novamente.');
        }

        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        let result;
        
        try {
          result = JSON.parse(contentStr);
        } catch (parseError) {
          logger.error('Erro ao parsear resposta da IA (prompt)', { content: contentStr, parseError });
          throw new AIServiceError('Resposta da IA está em formato incorreto.');
        }

        // Salvar no banco
        await db.insert(contentGeneration).values({
          userId: ctx.user.id,
          type: "prompt",
          title: input.description.substring(0, 100),
          content: JSON.stringify(result),
          metadata: JSON.stringify({
            style: input.style,
            platform: input.platform,
          }),
          creditsUsed: 1,
        });

        logger.info('Prompt generated', { userId: ctx.user.id });

        return result;
      } catch (error) {
        if (error instanceof AIServiceError) {
          throw error;
        }
        
        logger.error('Erro ao gerar prompt', {
          error: error instanceof Error ? error.message : String(error),
          userId: ctx.user.id,
        });
        
        throw new AIServiceError('Erro ao gerar prompt. Tente novamente.', error);
      }
    }),

  // Gerar anúncio
  generateAd: protectedProcedure
    .input(
      z.object({
        product: z.string().min(3),
        platform: z.enum(["instagram", "facebook", "google"]).default("instagram"),
        objective: z
          .enum(["awareness", "consideration", "conversion"])
          .default("conversion"),
        targetAudience: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = `Você é um especialista em copywriting para anúncios de estética.

Crie um anúncio completo para:
Produto/Serviço: ${input.product}
Plataforma: ${input.platform}
Objetivo: ${input.objective}
Público-alvo: ${input.targetAudience || "Mulheres 25-45 anos interessadas em estética"}

Forneça no formato JSON:
{
  "headline": "<título chamativo>",
  "primaryText": "<texto principal do anúncio>",
  "description": "<descrição curta>",
  "callToAction": "<CTA específico>",
  "hashtags": [<5-10 hashtags relevantes>],
  "variations": [
    {
      "headline": "<variação 1>",
      "primaryText": "<variação 1>"
    }
  ],
  "tips": "<dicas para otimizar o anúncio>"
}

Use técnicas de neurovendas e gatilhos mentais.`;

      try {
        const response = await llm.chat.completions.create({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em copywriting e neurovendas. Responda sempre em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.8,
        });

        const content = response.choices[0]?.message?.content;
        
        if (!content) {
          logger.error('IA retornou resposta vazia ao gerar anúncio');
          throw new AIServiceError('Não foi possível gerar o anúncio. Tente novamente.');
        }

        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        let ad;
        
        try {
          ad = JSON.parse(contentStr);
        } catch (parseError) {
          logger.error('Erro ao parsear resposta da IA (ad)', { content: contentStr, parseError });
          throw new AIServiceError('Resposta da IA está em formato incorreto.');
        }

        // Salvar no banco
        await db.insert(contentGeneration).values({
          userId: ctx.user.id,
          type: "ad",
          title: `Anúncio: ${input.product}`,
          content: JSON.stringify(ad),
          metadata: JSON.stringify({
            platform: input.platform,
            objective: input.objective,
          }),
          creditsUsed: 2,
        });

        logger.info('Ad generated', { userId: ctx.user.id, product: input.product });

        return ad;
      } catch (error) {
        if (error instanceof AIServiceError) {
          throw error;
        }
        
        logger.error('Erro ao gerar anúncio', {
          error: error instanceof Error ? error.message : String(error),
          userId: ctx.user.id,
        });
        
        throw new AIServiceError('Erro ao gerar anúncio. Tente novamente.', error);
      }
    }),

  // Listar conteúdo gerado
  // BUG-007: Query otimizada
  listGenerated: protectedProcedure
    .input(
      z.object({
        type: z.enum(["ebook", "prompt", "ad", "post"]).optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      // Query unificada
      const whereConditions = [eq(contentGeneration.userId, ctx.user.id)];
      if (input.type) {
        whereConditions.push(eq(contentGeneration.type, input.type));
      }
      
      const results = await db
        .select()
        .from(contentGeneration)
        .where(and(...whereConditions))
        .orderBy(desc(contentGeneration.createdAt))
        .limit(input.limit);

      // BUG-011: Parse seguro e eficiente
      return results.map((item) => ({
        ...item,
        content: safeParse(item.content),
        metadata: safeParse(item.metadata),
      }));
    }),

  // Obter conteúdo específico
  getContent: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [content] = await db
        .select()
        .from(contentGeneration)
        .where(
          and(
            eq(contentGeneration.id, input.id),
            eq(contentGeneration.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!content) {
        throw new NotFoundError("Conteúdo não encontrado");
      }

      return {
        ...content,
        content: safeParse(content.content),
        metadata: safeParse(content.metadata),
      };
    }),

  // Deletar conteúdo
  deleteContent: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(contentGeneration)
        .where(
          and(
            eq(contentGeneration.id, input.id),
            eq(contentGeneration.userId, ctx.user.id)
          )
        );

      logger.info('Content deleted', { contentId: input.id, userId: ctx.user.id });

      return {
        success: true,
        message: "Conteúdo deletado com sucesso",
      };
    }),
});
