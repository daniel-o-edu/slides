import { Theme, Slide } from "../types";

// Helper to download text as a file
export const downloadHTML = (filename: string, content: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/html'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

// Generate a standalone HTML file string
export const generateHTMLContent = (slides: Slide[], theme: Theme, title: string) => {
  const slidesHtml = slides.map((slide, index) => `
    <div class="slide" id="slide-${index}">
      <div class="slide-content">
        <h1>${slide.title}</h1>
        <ul>
          ${slide.content.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </div>
      <div class="footer">${index + 1} / ${slides.length}</div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: #333; }
        .container { display: flex; flex-direction: column; align-items: center; padding: 20px; gap: 20px; }
        .slide {
            width: 800px;
            height: 600px; /* 4:3 Aspect Ratio */
            background-color: ${theme.background};
            color: ${theme.text};
            position: relative;
            padding: 40px;
            box-sizing: border-box;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .slide h1 { color: ${theme.accent}; margin-bottom: 30px; font-size: 2.5em; text-align: center; }
        .slide ul { font-size: 1.5em; line-height: 1.6; padding-left: 40px; }
        .slide .footer { position: absolute; bottom: 20px; right: 20px; font-size: 0.8em; opacity: 0.6; }
    </style>
</head>
<body>
    <div class="container">
        ${slidesHtml}
    </div>
</body>
</html>
  `;
};

// PDF Generation using global jspdf (loaded via CDN in index.html)
// Note: In a real environment with bundlers, we'd import { jsPDF } from "jspdf"
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export const downloadPDF = async (presentationTitle: string) => {
  const slides = document.querySelectorAll('.printable-slide');
  if (!slides || slides.length === 0) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [800, 600] // 4:3 @ low res for file size, or 1024x768
  });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i] as HTMLElement;
    
    // We render the DOM element to a canvas
    const canvas = await window.html2canvas(slide, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      doc.addPage([800, 600], 'landscape');
    }

    doc.addImage(imgData, 'JPEG', 0, 0, 800, 600);
  }

  doc.save(`${presentationTitle.replace(/\s+/g, '_')}.pdf`);
};
