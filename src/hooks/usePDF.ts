import { useState, useCallback } from 'react';

interface PDFOptions {
  filename?: string;
  /** Element ID to capture. Defaults to the full document body. */
  elementId?: string;
  /** Extra padding added around the capture (px). Default 0. */
  padding?: number;
}

export function usePDF() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportPDF = useCallback(async (options: PDFOptions = {}) => {
    const { filename = 'propuesta-sixteam.pdf', elementId, padding = 0 } = options;

    setGenerating(true);
    setProgress(10);

    try {
      // Dynamic imports to keep initial bundle small
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jsPDFModule;

      setProgress(30);

      const target = elementId
        ? document.getElementById(elementId)
        : document.body;

      if (!target) throw new Error(`Element #${elementId} not found`);

      setProgress(50);

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#030d1a',
        width: target.scrollWidth + padding * 2,
        height: target.scrollHeight + padding * 2,
        x: -padding,
        y: -padding,
        windowWidth: 1280,
        onclone: (cloned) => {
          // Hide elements marked as no-print
          cloned.querySelectorAll<HTMLElement>('.no-print').forEach(
            (el) => (el.style.display = 'none')
          );
        },
      });

      setProgress(80);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = pageW / imgW;
      const totalPDFHeight = imgH * ratio;
      const pagesNeeded = Math.ceil(totalPDFHeight / pageH);

      for (let i = 0; i < pagesNeeded; i++) {
        if (i > 0) pdf.addPage();
        const srcY = (i * pageH) / ratio;
        pdf.addImage(imgData, 'JPEG', 0, -(i * pageH), pageW, totalPDFHeight);
        void srcY; // ratio calc is implicit through pdf coordinate shift
      }

      setProgress(95);
      pdf.save(filename);
      setProgress(100);
    } catch (err) {
      console.error('[usePDF] Error generating PDF:', err);
    } finally {
      setTimeout(() => {
        setGenerating(false);
        setProgress(0);
      }, 800);
    }
  }, []);

  return { exportPDF, generating, progress };
}
