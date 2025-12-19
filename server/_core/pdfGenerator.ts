import puppeteer from 'puppeteer';
import { marked } from 'marked';

export interface EbookPDFOptions {
  title: string;
  content: string;
  coverUrl?: string;
  author: string;
}

/**
 * Escapa caracteres HTML especiais para prevenir XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Valida e sanitiza URL para prevenir ataques
 */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Permitir apenas protocolos http e https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return url;
  } catch {
    return '';
  }
}

export async function generateEbookPDF(options: EbookPDFOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    // Use --no-sandbox apenas em ambientes containerizados (Docker)
    args: process.env.DOCKER_CONTAINER ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });

  try {
    const page = await browser.newPage();
    
    // Converter markdown para HTML
    const contentHtml = await marked(options.content);
    
    // Template HTML do e-book
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
      font-size: 12pt;
    }
    .cover {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      page-break-after: always;
    }
    .cover-image {
      max-width: 80%;
      max-height: 50vh;
      margin-bottom: 2rem;
    }
    .cover-title {
      font-size: 32pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1rem;
      color: #F59E0B;
    }
    .cover-author {
      font-size: 14pt;
      color: #666;
    }
    h1 {
      font-size: 24pt;
      color: #F59E0B;
      margin-top: 2rem;
      page-break-before: always;
    }
    h2 {
      font-size: 18pt;
      color: #D97706;
      margin-top: 1.5rem;
    }
    h3 {
      font-size: 14pt;
      color: #B45309;
    }
    p {
      text-align: justify;
      margin-bottom: 1rem;
    }
    ul, ol {
      margin-bottom: 1rem;
    }
    .page-number {
      position: fixed;
      bottom: 1cm;
      right: 1cm;
      font-size: 10pt;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="cover">
    ${options.coverUrl ? `<img src="${escapeHtml(sanitizeUrl(options.coverUrl))}" alt="Capa" class="cover-image">` : ''}
    <h1 class="cover-title">${escapeHtml(options.title)}</h1>
    <p class="cover-author">Por ${escapeHtml(options.author)}</p>
  </div>
  
  <div class="content">
    ${contentHtml}
  </div>
</body>
</html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 10pt; color: #999;">
          <span class="pageNumber"></span>
        </div>
      `,
      margin: {
        top: '2cm',
        bottom: '2cm',
        left: '2cm',
        right: '2cm',
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
}
