/**
 * PDF Generator for E-books
 * Generates PDF using browser's print functionality
 */

interface EbookChapter {
  number: number;
  title: string;
  content: string;
}

interface EbookData {
  title: string;
  subtitle?: string;
  description?: string;
  chapters: EbookChapter[];
  conclusion?: string;
  callToAction?: string;
  coverUrl?: string | null;
  createdAt?: string;
}

/**
 * Remove markdown formatting from text
 */
function stripMarkdown(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/`([^`]+)`/g, '$1') // Code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/^\s*[-*+]\s/gm, '• ') // Bullet points
    .replace(/^\s*\d+\.\s/gm, '') // Numbered lists
    .trim();
}

/**
 * Generate PDF using HTML and browser's print functionality
 */
export function printEbookAsPDF(ebook: EbookData): void {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Não foi possível abrir janela de impressão. Verifique se popups estão habilitados.');
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>${ebook.title}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .cover {
          text-align: center;
          padding: 100px 0;
          page-break-after: always;
        }
        
        .cover h1 {
          font-size: 2.5em;
          margin-bottom: 0.5em;
          color: #1a1a1a;
        }
        
        .cover .subtitle {
          font-size: 1.3em;
          color: #666;
          margin-bottom: 2em;
        }
        
        .cover .description {
          font-size: 1em;
          color: #555;
          max-width: 500px;
          margin: 0 auto 3em;
        }
        
        .cover .meta {
          font-size: 0.9em;
          color: #888;
        }
        
        .chapter {
          page-break-before: always;
        }
        
        .chapter-number {
          font-size: 0.9em;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.5em;
        }
        
        .chapter h2 {
          font-size: 1.8em;
          margin-bottom: 1em;
          color: #1a1a1a;
          border-bottom: 2px solid #eee;
          padding-bottom: 0.5em;
        }
        
        .chapter-content {
          text-align: justify;
        }
        
        .chapter-content p {
          margin-bottom: 1em;
        }
        
        .conclusion, .cta {
          page-break-before: always;
          background: #f9f9f9;
          padding: 30px;
          border-radius: 8px;
          margin: 2em 0;
        }
        
        .conclusion h2, .cta h2 {
          color: #1a1a1a;
          margin-bottom: 1em;
        }
        
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .conclusion, .cta {
            background: #f5f5f5 !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="cover">
        <h1>${ebook.title}</h1>
        ${ebook.subtitle ? `<div class="subtitle">${ebook.subtitle}</div>` : ''}
        ${ebook.description ? `<div class="description">${ebook.description}</div>` : ''}
        <div class="meta">
          <p>Gerado por Elevare IA</p>
          <p>${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      
      ${ebook.chapters.map(chapter => `
        <div class="chapter">
          <div class="chapter-number">Capítulo ${chapter.number}</div>
          <h2>${chapter.title}</h2>
          <div class="chapter-content">
            ${chapter.content.split('\n\n').map(p => `<p>${stripMarkdown(p)}</p>`).join('')}
          </div>
        </div>
      `).join('')}
      
      ${ebook.conclusion ? `
        <div class="conclusion">
          <h2>Conclusão</h2>
          <p>${stripMarkdown(ebook.conclusion)}</p>
        </div>
      ` : ''}
      
      ${ebook.callToAction ? `
        <div class="cta">
          <h2>Próximos Passos</h2>
          <p>${stripMarkdown(ebook.callToAction)}</p>
        </div>
      ` : ''}
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.print();
  };
}
