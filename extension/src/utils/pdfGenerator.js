import { jsPDF } from "jspdf";

export const downloadPDF = (content) => {
  const doc = new jsPDF();
  const pageWidth = 180;
  const splitText = doc.splitTextToSize(content, pageWidth);
  doc.setFontSize(12);
  doc.text(splitText, 10, 10);
  doc.save("Gemini_Report.pdf");
};