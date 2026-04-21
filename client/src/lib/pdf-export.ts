/**
 * PDF Export utilities for celebrations
 * Uses jsPDF and html2canvas for client-side PDF generation
 */

export interface SongForPDF {
  id: number;
  title: string;
  artist: string;
  lyrics?: string;
  chords?: string;
  massMoment: string;
}

export interface CelebrationForPDF {
  name: string;
  date: string;
  maestro?: string;
  songs: SongForPDF[];
}

/**
 * Generate PDF from celebration data
 * Creates a professional-looking sheet music document
 */
export async function generateCelebrationPDF(celebration: CelebrationForPDF) {
  // Dynamically import jsPDF to avoid build issues
  const { jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  // Create a temporary container for rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '210mm'; // A4 width
  container.style.padding = '20mm';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '12px';
  container.style.lineHeight = '1.6';
  container.style.color = '#333';

  // Build HTML content
  let html = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 28px; margin: 0; color: #6B21A8;">${celebration.name}</h1>
      <p style="margin: 5px 0; color: #666;">
        ${new Date(celebration.date).toLocaleDateString('pt-BR')}
      </p>
      ${celebration.maestro ? `<p style="margin: 5px 0; color: #666;">Maestro: ${celebration.maestro}</p>` : ''}
    </div>

    <div style="border-top: 2px solid #6B21A8; padding-top: 20px;">
  `;

  // Add each song
  celebration.songs.forEach((song, index) => {
    html += `
      <div style="page-break-inside: avoid; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <div>
            <h2 style="font-size: 18px; margin: 0; color: #6B21A8;">${index + 1}. ${song.title}</h2>
            <p style="margin: 5px 0 0 0; color: #666; font-style: italic;">${song.artist}</p>
          </div>
          <span style="background-color: #F3E8FF; color: #6B21A8; padding: 5px 10px; border-radius: 20px; font-size: 11px;">
            ${song.massMoment}
          </span>
        </div>

        ${song.chords ? `
          <div style="background-color: #F9F5FF; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <p style="margin: 0; font-weight: bold; color: #6B21A8; font-size: 11px;">CIFRAS:</p>
            <pre style="margin: 5px 0 0 0; font-family: 'Courier New', monospace; font-size: 10px; white-space: pre-wrap; word-wrap: break-word;">${song.chords}</pre>
          </div>
        ` : ''}

        ${song.lyrics ? `
          <div style="background-color: #FAFAFA; padding: 10px; border-radius: 5px;">
            <p style="margin: 0; font-weight: bold; color: #333; font-size: 11px;">LETRA:</p>
            <pre style="margin: 5px 0 0 0; font-family: 'Courier New', monospace; font-size: 10px; white-space: pre-wrap; word-wrap: break-word;">${song.lyrics}</pre>
          </div>
        ` : ''}
      </div>
    `;
  });

  html += `
    </div>
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 10px;">
      <p>Gerado por CELEBRA - Gestão Musical Litúrgica</p>
      <p>${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add pages as needed
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Download PDF
    const filename = `${celebration.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

/**
 * Simple text-based PDF export (fallback)
 * Creates a basic PDF with text content
 */
export async function generateSimplePDF(celebration: CelebrationForPDF) {
  const { jsPDF } = await import('jspdf');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const lineHeight = 7;
  const margin = 15;
  const maxWidth = 180;

  // Title
  pdf.setFontSize(18);
  pdf.setTextColor(107, 33, 168); // Purple
  pdf.text(celebration.name, margin, yPosition);
  yPosition += 15;

  // Date and maestro
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Data: ${new Date(celebration.date).toLocaleDateString('pt-BR')}`, margin, yPosition);
  yPosition += lineHeight;

  if (celebration.maestro) {
    pdf.text(`Maestro: ${celebration.maestro}`, margin, yPosition);
    yPosition += lineHeight;
  }

  yPosition += 10;

  // Songs
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);

  celebration.songs.forEach((song, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }

    // Song number and title
    pdf.setFontSize(12);
    pdf.setTextColor(107, 33, 168);
    pdf.text(`${index + 1}. ${song.title}`, margin, yPosition);
    yPosition += lineHeight;

    // Artist
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${song.artist} - ${song.massMoment}`, margin, yPosition);
    yPosition += lineHeight + 3;

    // Chords
    if (song.chords) {
      pdf.setFontSize(9);
      pdf.setTextColor(107, 33, 168);
      pdf.text('Cifras:', margin, yPosition);
      yPosition += lineHeight;

      const chordsLines = pdf.splitTextToSize(song.chords, maxWidth);
      chordsLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text(line, margin + 5, yPosition);
        yPosition += lineHeight - 2;
      });
      yPosition += 3;
    }

    // Lyrics
    if (song.lyrics) {
      pdf.setFontSize(9);
      pdf.setTextColor(107, 33, 168);
      pdf.text('Letra:', margin, yPosition);
      yPosition += lineHeight;

      const lyricsLines = pdf.splitTextToSize(song.lyrics, maxWidth);
      lyricsLines.slice(0, 5).forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text(line, margin + 5, yPosition);
        yPosition += lineHeight - 2;
      });

      if (lyricsLines.length > 5) {
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('... (letra completa no app)', margin + 5, yPosition);
      }
    }

    yPosition += 10;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    'Gerado por CELEBRA - Gestão Musical Litúrgica',
    margin,
    pageHeight - 10
  );

  // Download
  const filename = `${celebration.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
