export async function downloadQuotationPDF(elementOrHtml: HTMLElement | string, filename: string) {
  if (typeof window === "undefined") return;
  try {
    const html2pdfModule: any = await import("html2pdf.js");
    const html2pdf: any = html2pdfModule.default || html2pdfModule;

    const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

    const opt = {
      margin: [10, 8, 10, 8],
      filename: cleanFilename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    await (html2pdf as any)().set(opt).from(elementOrHtml).save();
  } catch (error) {
    console.error("PDF generation failed:", error);
    window.print();
  }
}