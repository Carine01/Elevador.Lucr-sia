import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";





























































































































































































































































































































































































































};  printEbookAsPDF,  downloadEbookPDF,  generateEbookPDF,export default {}  };    printWindow.print();  printWindow.onload = () => {  // Aguardar carregamento e imprimir    printWindow.document.close();  printWindow.document.write(html);  `;    </html>    </body>      ` : ''}        </div>          <p>${stripMarkdown(ebook.callToAction)}</p>          <h2>Próximos Passos</h2>        <div class="cta">      ${ebook.callToAction ? `      ` : ''}        </div>          <p>${stripMarkdown(ebook.conclusion)}</p>          <h2>Conclusão</h2>        <div class="conclusion">      ${ebook.conclusion ? `      `).join('')}        </div>          </div>            ${chapter.content.split('\n\n').map(p => `<p>${stripMarkdown(p)}</p>`).join('')}          <div class="chapter-content">          <h2>${chapter.title}</h2>          <div class="chapter-number">Capítulo ${chapter.number}</div>        <div class="chapter">      ${ebook.chapters.map(chapter => `      </div>        </div>          <p>${new Date().toLocaleDateString('pt-BR')}</p>          <p>Gerado por Elevare IA</p>        <div class="meta">        ${ebook.description ? `<div class="description">${ebook.description}</div>` : ''}        ${ebook.subtitle ? `<div class="subtitle">${ebook.subtitle}</div>` : ''}        <h1>${ebook.title}</h1>      <div class="cover">    <body>    </head>      </style>        }          }            background: #f5f5f5 !important;          .conclusion, .cta {          }            -webkit-print-color-adjust: exact;            print-color-adjust: exact;          body {        @media print {        }          margin-bottom: 1em;          color: #1a1a1a;        .conclusion h2, .cta h2 {        }          margin: 2em 0;          border-radius: 8px;          padding: 30px;          background: #f9f9f9;          page-break-before: always;        .conclusion, .cta {        }          margin-bottom: 1em;        .chapter-content p {        }          text-align: justify;        .chapter-content {        }          padding-bottom: 0.5em;          border-bottom: 2px solid #eee;          color: #1a1a1a;          margin-bottom: 1em;          font-size: 1.8em;        .chapter h2 {        }          margin-bottom: 0.5em;          letter-spacing: 2px;          text-transform: uppercase;          color: #888;          font-size: 0.9em;        .chapter-number {        }          page-break-before: always;        .chapter {        }          color: #888;          font-size: 0.9em;        .cover .meta {        }          margin: 0 auto 3em;          max-width: 500px;          color: #555;          font-size: 1em;        .cover .description {        }          margin-bottom: 2em;          color: #666;          font-size: 1.3em;        .cover .subtitle {        }          color: #1a1a1a;          margin-bottom: 0.5em;          font-size: 2.5em;        .cover h1 {        }          page-break-after: always;          padding: 100px 0;          text-align: center;        .cover {        }          padding: 20px;          margin: 0 auto;          max-width: 800px;          color: #333;          line-height: 1.6;          font-family: 'Georgia', serif;        body {        }          margin: 2cm;          size: A4;        @page {      <style>      <title>${ebook.title}</title>      <meta charset="UTF-8">    <head>    <html lang="pt-BR">    <!DOCTYPE html>  const html = `  }    throw new Error('Não foi possível abrir janela de impressão. Verifique se popups estão habilitados.');  if (!printWindow) {  const printWindow = window.open('', '_blank');export function printEbookAsPDF(ebook: EbookData): void { */ * Gera PDF usando HTML e print (alternativa mais simples)/**}  }    throw new Error('Não foi possível gerar o PDF. Tente novamente.');    console.error('Erro ao gerar PDF:', error);  } catch (error) {    URL.revokeObjectURL(url);        document.body.removeChild(link);    link.click();    document.body.appendChild(link);    link.download = filename || `${ebook.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;    link.href = url;    const link = document.createElement('a');        const url = URL.createObjectURL(blob);    const blob = await generateEbookPDF(ebook);  try {export async function downloadEbookPDF(ebook: EbookData, filename?: string): Promise<void> { */ * Gera e baixa PDF do e-book/**}  return new Blob([pdfContent], { type: 'application/pdf' });    pdfContent += `trailer\n<<\n/Size ${objects.length + 1}\n/Root 1 0 R\n>>\nstartxref\n${xrefOffset}\n%%EOF`;  // trailer    }    pdfContent += `${offset.toString().padStart(10, '0')} 00000 n \n`;  for (const offset of offsets) {  pdfContent += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;  const xrefOffset = pdfContent.length;  // xref table    }    currentOffset += objStr.length;    pdfContent += objStr;    const objStr = `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;    offsets.push(currentOffset);  for (let i = 0; i < objects.length; i++) {    let currentOffset = pdfContent.length;  const offsets: number[] = [];  // Montar PDF final    objects[1] = `<<\n/Type /Pages\n/Kids [${pageRefs.map(r => `${r} 0 R`).join(' ')}]\n/Count ${pageRefs.length}\n>>`;  // Atualizar objeto Pages    }    createPage(page);  for (const page of pages) {  // Criar as páginas no PDF    }    pages.push(currentPage);  if (currentPage.length > 0) {  // Adicionar última página    }    }      addText(line, 11, false);    for (const line of ctaLines) {    const ctaLines = splitTextIntoLines(stripMarkdown(ebook.callToAction), contentWidth, 11);    addSpace(20);    addText('Próximos Passos', 18, true);  if (ebook.callToAction) {  // CTA    }    addSpace(30);    }      addText(line, 11, false);    for (const line of conclusionLines) {    const conclusionLines = splitTextIntoLines(stripMarkdown(ebook.conclusion), contentWidth, 11);    addSpace(20);    addText('Conclusão', 18, true);  if (ebook.conclusion) {  // Conclusão    }    addSpace(30);        }      addSpace(10);      }        addText(line, 11, false);      for (const line of lines) {      const lines = splitTextIntoLines(paragraph.trim(), contentWidth, 11);    for (const paragraph of paragraphs) {        const paragraphs = cleanContent.split('\n\n');    const cleanContent = stripMarkdown(chapter.content);    // Conteúdo do capítulo        addSpace(20);    addText(chapter.title, 18, true);    addSpace(10);    addText(`Capítulo ${chapter.number}`, 12, true);    // Título do capítulo  for (const chapter of ebook.chapters) {  // Capítulos    yPosition = pageHeight - margin;  currentPage = [];  pages.push([...currentPage]);  addText(new Date().toLocaleDateString('pt-BR'), 10, false);  addText('Gerado por Elevare IA', 10, false);  addSpace(60);  }    }      addText(line, 11, false);    for (const line of descLines) {    const descLines = splitTextIntoLines(stripMarkdown(ebook.description), contentWidth, 11);    addSpace(40);  if (ebook.description) {  }    addText(ebook.subtitle, 14, false);    addSpace(20);  if (ebook.subtitle) {  addText(ebook.title, 24, true);  yPosition = pageHeight - 200;  // Página de capa    };    }      yPosition = pageHeight - margin;      currentPage = [];      pages.push([...currentPage]);    if (yPosition < margin) {    yPosition -= space;  const addSpace = (space: number) => {    };    }      yPosition -= fontSize * lineHeight;      currentPage.push(`BT ${font} ${fontSize} Tf ${margin} ${yPosition} Td (${escapedLine}) Tj ET`);              .replace(/\)/g, '\\)');        .replace(/\(/g, '\\(')        .replace(/\\/g, '\\\\')      const escapedLine = line      // Escapar caracteres especiais do PDF            }        yPosition = pageHeight - margin;        currentPage = [];        pages.push([...currentPage]);      if (yPosition < margin + fontSize) {    for (const line of lines) {        const lines = text.split('\n');    const font = isBold ? '/F2' : '/F1';  const addText = (text: string, fontSize: number, isBold: boolean = false, lineHeight: number = 1.4) => {    let yPosition = pageHeight - margin;  let currentPage: string[] = [];  const pages: string[][] = [];  // Gerar conteúdo das páginas    };    pageRefs.push(pageRef);    const pageRef = addObject(`<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 ${pageWidth} ${pageHeight}]\n/Contents ${contentRef} 0 R\n/Resources <<\n/Font <<\n/F1 3 0 R\n/F2 4 0 R\n>>\n>>\n>>`);    const contentRef = addObject(`<<\n/Length ${content.join('\n').length}\n>>\nstream\n${content.join('\n')}\nendstream`);  const createPage = (content: string[]): void => {  // Função para criar página    const fontBoldRef = addObject('<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica-Bold\n>>');  const fontRef = addObject('<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>');  // Font    const pagesRef = addObject(''); // Será atualizado depois  // Pages (placeholder)    const catalogRef = addObject('<<\n/Type /Catalog\n/Pages 2 0 R\n>>');  // Catalog    };    return objectCount;    objects.push(content);    objectCount++;  const addObject = (content: string): number => {  // Função auxiliar para adicionar objeto    const pageRefs: number[] = [];  const objects: string[] = [];  let objectCount = 0;  let pdfContent = '%PDF-1.4\n';    const contentWidth = pageWidth - (margin * 2);  const margin = 50;  const pageHeight = 842;  const pageWidth = 595; // A4 em pontos  // Criar um PDF simples usando a API de Data URLexport async function generateEbookPDF(ebook: EbookData): Promise<Blob> { */ * Gera PDF do e-book usando Canvas API (sem dependências externas)/**}  return lines;    if (currentLine) lines.push(currentLine);  }    }      currentLine = word;      if (currentLine) lines.push(currentLine);    } else {      currentLine = (currentLine + ' ' + word).trim();    if ((currentLine + ' ' + word).trim().length <= charsPerLine) {  for (const word of words) {    const charsPerLine = Math.floor(maxWidth / (fontSize * 0.5));  // Aproximação de caracteres por linha baseado no tamanho da fonte    let currentLine = '';  const lines: string[] = [];  const words = text.split(' ');function splitTextIntoLines(text: string, maxWidth: number, fontSize: number): string[] {// Quebrar texto em linhas para caber na página}    .trim();    .replace(/^\s*\d+\.\s/gm, '') // Numbered lists    .replace(/^\s*[-*+]\s/gm, '• ') // Bullet points    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links    .replace(/`([^`]+)`/g, '$1') // Code    .replace(/\*([^*]+)\*/g, '$1') // Italic    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold    .replace(/#{1,6}\s/g, '') // Headers  return textfunction stripMarkdown(text: string): string {// Remover tags markdown do texto}  return jsPDF;  const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');  // @ts-ignore - Import dinâmico do jspdf via CDNasync function loadJsPDF() {// Função para carregar jspdf dinamicamente}  createdAt?: string;  coverUrl?: string | null;  callToAction?: string;  conclusion?: string;  chapters: EbookChapter[];  description?: string;  subtitle?: string;  title: string;interface EbookData {}  content: string;  title: string;  number: number;interface EbookChapter {// Tipos para o e-book */ * Usa jspdf para gerar PDF no lado do clienteimport { db } from "../db";
import { contentGeneration } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { llm } from "../_core/llm";
import { imageGeneration } from "../_core/imageGeneration";
import { logger } from "../_core/logger";
import { AIServiceError, NotFoundError } from "../_core/errors";
import { safeParse } from "../../shared/_core/utils";
import { checkCredits, consumeCredits } from "../_core/credits";

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
      // 🔒 Verificar créditos antes de gerar
      await checkCredits(ctx.user.id, 'post');
      
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

        // 💳 Consumir créditos após geração bem-sucedida
        await consumeCredits(ctx.user.id, 'post', `Conteúdo: ${input.type}`);

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
      // 🔒 Verificar créditos antes de gerar e-book
      await checkCredits(ctx.user.id, 'ebook');
      
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

        // 💳 Consumir créditos após geração bem-sucedida
        await consumeCredits(ctx.user.id, 'ebook', `E-book: ${input.topic}`);

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
      // 🔒 Verificar créditos antes de gerar capa
      await checkCredits(ctx.user.id, 'post');
      
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

        // 💳 Consumir créditos após geração bem-sucedida
        await consumeCredits(ctx.user.id, 'post', 'Capa de e-book');

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
      // 🔒 Verificar créditos antes de gerar prompt
      await checkCredits(ctx.user.id, 'post');
      
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

        // 💳 Consumir créditos após geração bem-sucedida
        await consumeCredits(ctx.user.id, 'post', 'Prompt de imagem');

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
      // 🔒 Verificar créditos antes de gerar anúncio
      await checkCredits(ctx.user.id, 'ad');
      
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

        // 💳 Consumir créditos após geração bem-sucedida
        await consumeCredits(ctx.user.id, 'ad', `Anúncio: ${input.product}`);

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
      return results.map((item: typeof results[0]) => ({
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

  // 📄 Exportar e-book para PDF (retorna dados formatados para geração client-side)
  exportEbookData: protectedProcedure
    .input(
      z.object({
        ebookId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [ebook] = await db
        .select()
        .from(contentGeneration)
        .where(
          and(
            eq(contentGeneration.id, input.ebookId),
            eq(contentGeneration.userId, ctx.user.id),
            eq(contentGeneration.type, "ebook")
          )
        )
        .limit(1);

      if (!ebook) {
        throw new NotFoundError("E-book não encontrado");
      }

      const content = safeParse(ebook.content);
      const metadata = safeParse(ebook.metadata);

      logger.info('E-book data exported for PDF', { 
        ebookId: input.ebookId, 
        userId: ctx.user.id 
      });

      return {
        id: ebook.id,
        title: content?.title || ebook.title,
        subtitle: content?.subtitle || '',
        description: content?.description || '',
        chapters: content?.chapters || [],
        conclusion: content?.conclusion || '',
        callToAction: content?.callToAction || '',
        coverUrl: metadata?.coverUrl || null,
        createdAt: ebook.createdAt,
      };
    }),
});
