import PDFDocument from 'pdfkit';

export interface EbookData {
  title: string;
  subtitle?: string;
  author?: string;
  chapters: Array<{
    number: number;
    title: string;
    content: string;
  }>;
  conclusion?: string;
}

/**
 * Gera PDF de e-book com formatação profissional
 * @returns Buffer do PDF
 */
export async function generateEbookPDF(data: EbookData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: data.title,
        Author: data.author || 'Elevare AI',
        Subject: data.subtitle,
        Creator: 'Elevare AI NeuroVendas',
      },
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ============================================
    // CAPA
    // ============================================
    doc
      .fontSize(32)
      .font('Helvetica-Bold')
      .fillColor('#6b2fa8') // roxo Elevare
      .text(data.title, { align: 'center' });

    if (data.subtitle) {
      doc
        .moveDown(1)
        .fontSize(18)
        .font('Helvetica')
        .fillColor('#333')
        .text(data.subtitle, { align: 'center' });
    }

    doc
      .moveDown(2)
      .fontSize(12)
      .fillColor('#999')
      .text(data.author || 'Powered by Elevare AI', { align: 'center' });

    // Linha decorativa
    doc
      .moveDown(3)
      .strokeColor('#b8975a') // dourado
      .lineWidth(2)
      .moveTo(doc.page.width / 2 - 100, doc.y)
      .lineTo(doc.page.width / 2 + 100, doc.y)
      .stroke();

    // ============================================
    // ÍNDICE
    // ============================================
    doc.addPage();
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Índice', { align: 'left' });

    doc.moveDown(1);

    data.chapters.forEach((chapter) => {
      doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#555')
        .text(`${chapter.number}. ${chapter.title}`, { indent: 20 });
      doc.moveDown(0.5);
    });

    // ============================================
    // CAPÍTULOS
    // ============================================
    data.chapters.forEach((chapter) => {
      doc.addPage();

      // Título do capítulo
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#6b2fa8')
        .text(`Capítulo ${chapter.number}`, { align: 'left' });

      doc
        .fontSize(18)
        .fillColor('#333')
        .text(chapter.title, { align: 'left' });

      doc.moveDown(1.5);

      // Conteúdo do capítulo
      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#444')
        .text(chapter.content, {
          align: 'justify',
          lineGap: 4,
        });
    });

    // ============================================
    // CONCLUSÃO
    // ============================================
    if (data.conclusion) {
      doc.addPage();

      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#6b2fa8')
        .text('Conclusão', { align: 'left' });

      doc.moveDown(1);

      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#444')
        .text(data.conclusion, { align: 'justify', lineGap: 4 });
    }

    // ============================================
    // RODAPÉ EM TODAS AS PÁGINAS
    // ============================================
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      doc
        .fontSize(9)
        .fillColor('#999')
        .text(
          `Gerado por Elevare AI | Página ${i + 1} de ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
    }

    // Finalizar PDF
    doc.end();
  });
}
