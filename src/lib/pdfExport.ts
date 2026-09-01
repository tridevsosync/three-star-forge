import { Quotation } from "@/types";
import { formatINR, numberToIndianWords } from "./numberToWords";

/**
 * Format currency for clean PDF output (e.g. Rs. 24,50,000.00)
 */
function formatPdfCurrency(amount: number): string {
  if (isNaN(amount)) return "Rs. 0.00";
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
  return `Rs. ${formatted}`;
}

/**
 * Downloads a clean, vector, high-resolution official PDF quotation proposal directly to the client disk
 * using pure jsPDF and jspdf-autotable.
 * This completely avoids HTML rasterization / html2canvas clipping / negative z-index blank page issues!
 */
export async function downloadQuotationDirectly(q: Quotation): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default || autoTableModule;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    const quoteNo = q.quoteNumber || "TSE/QT/2026/0001";
    const issuedDate = new Date(q.issuedDate || Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const validUntilDate = new Date(
      q.validUntil ||
        (q.issuedDate
          ? new Date(q.issuedDate).getTime() + (q.commercialTerms?.validityDays || 30) * 86400000
          : Date.now() + 30 * 86400000)
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    let y = 14;

    // Top Accent Stripe
    doc.setFillColor(30, 58, 138); // #1e3a8a
    doc.rect(margin, y, contentWidth, 1.5, "F");
    y += 7;

    // Company Header Left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text("THREE STAR ENTERPRISES", margin, y);

    // Commercial Proposal Header Right
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // #0f172a
    doc.text("COMMERCIAL PROPOSAL", pageWidth - margin, y, { align: "right" });

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Special Purpose Machines • CNC Induction Hardening Plants • Automation Systems", margin, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text(`Ref: ${quoteNo}`, pageWidth - margin, y, { align: "right" });

    y += 4.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 58, 138);
    doc.text("ISO 9001:2015 Certified Manufacturing Facility • Pune Works", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${issuedDate}`, pageWidth - margin, y, { align: "right" });

    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Works: Sr No 12/2, Dehu Alandi Road, Dehu Gaon, Pune - 412109, Maharashtra, India", margin, y);
    doc.text(`Validity: ${q.commercialTerms?.validityDays || 30} Days (Until ${validUntilDate})`, pageWidth - margin, y, {
      align: "right",
    });

    y += 3.5;
    doc.text("GSTIN: 27AABCT1234F1Z5 | Email: sales@threestarforge.com | Web: www.threestarforge.com", margin, y);

    y += 4;
    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // Two Info Cards Side-by-Side
    const boxWidth = (contentWidth - 6) / 2;
    const boxHeight = 36;

    // Left Box: Client Info
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("QUOTATION PREPARED FOR:", margin + 3, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(q.client?.name || "Client Representative", margin + 3, y + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text(q.client?.company || "Client Enterprise Ltd", margin + 3, y + 14.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    if (q.client?.designation) {
      doc.text(q.client.designation, margin + 3, y + 18.5);
    }
    doc.text(`Phone: ${q.client?.phone || "N/A"}  |  Email: ${q.client?.email || "N/A"}`, margin + 3, y + 23);
    if (q.client?.gstin) {
      doc.text(`GSTIN: ${q.client.gstin}`, margin + 3, y + 27.5);
    }
    if (q.client?.billingAddress) {
      const addressLines = doc.splitTextToSize(`Address: ${q.client.billingAddress}`, boxWidth - 6);
      doc.text(addressLines[0] || "", margin + 3, y + 32);
    }

    // Right Box: Machinery Scope
    const rightBoxX = margin + boxWidth + 6;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(rightBoxX, y, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("MACHINERY SCOPE & PARAMETERS:", rightBoxX + 3, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    const projTitleLines = doc.splitTextToSize(q.project?.title || "Custom Machinery Turnkey System", boxWidth - 6);
    doc.text(projTitleLines[0] || "", rightBoxX + 3, y + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text(`Category: ${q.project?.category || "Induction Hardening"}`, rightBoxX + 3, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Delivery Schedule: ${q.commercialTerms?.deliveryTimeline || "8 - 12 Weeks"}`, rightBoxX + 3, y + 20);
    doc.text(`Plant Works Site: ${q.client?.plantLocation || "Customer Plant Works"}`, rightBoxX + 3, y + 24.5);
    if (q.project?.referenceDocName) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text(`Ref Drawing: ${q.project.referenceDocName}`, rightBoxX + 3, y + 29);
    }

    y += boxHeight + 5;

    // Line Items Table with AutoTable
    const tableBody = (q.lineItems || []).map((item, idx) => {
      let desc = item.description || "Machinery Item";
      if (item.discountPercent) {
        desc += `\n[ ${item.discountPercent}% Discount Applied ]`;
      }
      return [
        String(idx + 1),
        desc,
        item.hsnCode || "8479",
        `${item.quantity} ${item.unit || "Nos"}`,
        formatPdfCurrency(item.unitPrice),
        `${item.taxPercent || 18}%`,
        formatPdfCurrency(item.amount),
      ];
    });

    (autoTable as any)(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["#", "Equipment Description & Specifications", "HSN", "Qty", "Unit Rate", "GST %", "Total (Rs.)"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42], // #0f172a
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: "bold",
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 16, halign: "center" },
        3: { cellWidth: 18, halign: "right" },
        4: { cellWidth: 26, halign: "right" },
        5: { cellWidth: 14, halign: "right" },
        6: { cellWidth: 28, halign: "right", fontStyle: "bold", textColor: [30, 58, 138] },
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2.2,
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
        textColor: [15, 23, 42],
        overflow: "linebreak",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
    y = finalY + 4;

    // Check if new page is needed for summary and terms
    if (y > pageHeight - 75) {
      doc.addPage();
      y = 14;
    }

    // Financial Totals and Bank Details
    const totalsBoxWidth = 72;
    const totalsBoxHeight = 28;
    const totalsBoxX = pageWidth - margin - totalsBoxWidth;

    // Left: Words & Bank Wire Details
    const leftSummaryWidth = contentWidth - totalsBoxWidth - 6;

    // Amount in Words
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, leftSummaryWidth, 12, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL AMOUNT IN WORDS:", margin + 3, y + 4);

    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const wordsLines = doc.splitTextToSize(numberToIndianWords(q.grandTotal), leftSummaryWidth - 6);
    doc.text(wordsLines[0] || "", margin + 3, y + 8.5);

    // Bank Details Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y + 14, leftSummaryWidth, 14, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(30, 58, 138);
    doc.text("COMPANY WIRE TRANSFER / BANK DETAILS:", margin + 3, y + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text("Beneficiary: THREE STAR ENTERPRISES  |  Bank: HDFC Bank Ltd", margin + 3, y + 22);
    doc.text("A/c No: 50200084791234  |  IFSC: HDFC0001234  |  Branch: Chakan Industrial Area, Pune", margin + 3, y + 25.5);

    // Right: Financial Totals Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(totalsBoxX, y, totalsBoxWidth, totalsBoxHeight, 2, 2, "FD");

    let totalsY = y + 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Equipment Subtotal:", totalsBoxX + 3, totalsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(formatPdfCurrency(q.subtotal), totalsBoxX + totalsBoxWidth - 3, totalsY, { align: "right" });

    if (q.discountTotal) {
      totalsY += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(22, 163, 74);
      doc.text("Total Discount:", totalsBoxX + 3, totalsY);
      doc.setFont("helvetica", "bold");
      doc.text(`- ${formatPdfCurrency(q.discountTotal)}`, totalsBoxX + totalsBoxWidth - 3, totalsY, { align: "right" });
    }

    totalsY += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Integrated GST (18%):", totalsBoxX + 3, totalsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(formatPdfCurrency(q.taxTotal), totalsBoxX + totalsBoxWidth - 3, totalsY, { align: "right" });

    totalsY += 6;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.4);
    doc.line(totalsBoxX + 3, totalsY - 2, totalsBoxX + totalsBoxWidth - 3, totalsY - 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text("Grand Total:", totalsBoxX + 3, totalsY + 1.5);
    doc.text(formatPdfCurrency(q.grandTotal), totalsBoxX + totalsBoxWidth - 3, totalsY + 1.5, { align: "right" });

    y += totalsBoxHeight + 4;

    // Commercial Terms and Conditions
    if (y > pageHeight - 55) {
      doc.addPage();
      y = 14;
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 58, 138);
    doc.text("COMMERCIAL TERMS & GUARANTEES:", margin + 3, y + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);

    let termsY = y + 9;
    const payment = `1. Payment Terms: ${q.commercialTerms?.paymentTerms || "30% Advance with PO, 60% against FAT trial in Pune, 10% after commissioning."}`;
    doc.text(doc.splitTextToSize(payment, contentWidth - 6)[0] || "", margin + 3, termsY);

    termsY += 3.8;
    const delivery = `2. Delivery Schedule: ${q.commercialTerms?.deliveryTimeline || "8 - 12 Weeks from drawing approval and advance receipt."}`;
    doc.text(doc.splitTextToSize(delivery, contentWidth - 6)[0] || "", margin + 3, termsY);

    termsY += 3.8;
    const fat = `3. Factory Acceptance Trials (FAT): ${q.commercialTerms?.inspectionFAT || "100% FAT trial & workpiece cycle trial at Pune plant prior to dispatch."}`;
    doc.text(doc.splitTextToSize(fat, contentWidth - 6)[0] || "", margin + 3, termsY);

    termsY += 3.8;
    const warranty = `4. Warranty: ${q.commercialTerms?.warranty || "12 Months from commissioning or 18 months from dispatch date, whichever is earlier."}`;
    doc.text(doc.splitTextToSize(warranty, contentWidth - 6)[0] || "", margin + 3, termsY);

    termsY += 3.8;
    const freight = `5. Freight: ${q.commercialTerms?.freightTerms || "Ex-Works Pune Plant. Freight, packing & transit insurance extra at actuals."}`;
    doc.text(doc.splitTextToSize(freight, contentWidth - 6)[0] || "", margin + 3, termsY);

    termsY += 3.8;
    const validity = `6. Validity: Valid for ${q.commercialTerms?.validityDays || 30} Days from proposal issuance.`;
    doc.text(validity, margin + 3, termsY);

    if (q.commercialTerms?.specialNotes) {
      termsY += 3.8;
      const notes = `7. Special Notes: ${q.commercialTerms.specialNotes}`;
      doc.text(doc.splitTextToSize(notes, contentWidth - 6)[0] || "", margin + 3, termsY);
    }

    y += 38;

    // Signatures
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 14;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Prepared by:", margin, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(q.preparedBy || "Three Star Enterprises Engineering Division", margin, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Pune Engineering Works Plant", margin, y + 7.5);

    // Right Signature
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("For THREE STAR ENTERPRISES", pageWidth - margin, y, { align: "right" });

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);
    doc.line(pageWidth - margin - 45, y + 10, pageWidth - margin, y + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text("Authorized Signatory", pageWidth - margin - 22.5, y + 13.5, { align: "center" });

    // Save File
    const sanitizedQuoteNo = quoteNo.replace(/[\/\\]/g, "-");
    const sanitizedCompany = (q.client?.company || "Client").replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
    const filename = `Quotation-${sanitizedQuoteNo}-${sanitizedCompany}.pdf`;

    doc.save(filename);
    return true;
  } catch (error) {
    console.error("Direct PDF generation error:", error);
    return false;
  }
}

/**
 * Generates an official, clean, high-resolution HTML template for commercial quotations
 */
export function getQuotationHTML(q: Quotation): string {
  const quoteNo = q.quoteNumber || "TSE/QT/2026/0001";
  const issuedDate = new Date(q.issuedDate || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const validUntilDate = new Date(
    q.validUntil ||
      (q.issuedDate
        ? new Date(q.issuedDate).getTime() + (q.commercialTerms?.validityDays || 30) * 86400000
        : Date.now() + 30 * 86400000)
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const lineItems = q.lineItems && q.lineItems.length > 0 ? q.lineItems : [];

  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0c1829; padding: 28px 32px; background: #ffffff; line-height: 1.45; font-size: 11px; max-width: 800px; margin: 0 auto; box-sizing: border-box;">
    
    <!-- Top Letterhead -->
    <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div style="font-size: 20px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.3px;">THREE STAR ENTERPRISES</div>
        <div style="font-size: 11px; color: #475569; margin-top: 3px; font-weight: 600;">Special Purpose Machines • CNC Induction Hardening Plants • Automation Systems</div>
        <div style="font-size: 9.5px; font-weight: 700; background: #eff6ff; color: #1e3a8a; padding: 3px 8px; border-radius: 4px; border: 1px solid #bfdbfe; text-transform: uppercase; margin-top: 5px; display: inline-block;">
          ISO 9001:2015 Certified Manufacturing Facility • Pune Works
        </div>
        <div style="font-size: 10px; color: #64748b; margin-top: 5px; line-height: 1.4;">
          Works: Sr No 12/2, Dehu Alandi Road, Dehu Gaon, Pune - 412109, Maharashtra, India<br/>
          GSTIN: <strong style="color: #0c1829;">27AABCT1234F1Z5</strong> • Email: <strong style="color: #0c1829;">sales@threestarforge.com</strong> • Web: <strong style="color: #0c1829;">www.threestarforge.com</strong>
        </div>
      </div>
      <div style="text-align: right; min-width: 190px;">
        <div style="font-size: 16px; font-weight: 800; color: #0c1829; text-transform: uppercase; letter-spacing: 0.5px;">COMMERCIAL PROPOSAL</div>
        <div style="font-size: 12px; font-weight: 700; color: #1e3a8a; margin-top: 4px;">Ref: ${quoteNo}</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 3px;">Date: <strong style="color: #0c1829;">${issuedDate}</strong></div>
        <div style="font-size: 10px; color: #64748b;">Validity: <strong style="color: #0c1829;">${q.commercialTerms?.validityDays || 30} Days</strong> (Until ${validUntilDate})</div>
      </div>
    </div>

    <!-- Client & Project Metadata Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
        <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 5px; letter-spacing: 0.5px;">Quotation Prepared For:</div>
        <div style="font-size: 13px; font-weight: 700; color: #0c1829;">${q.client?.name || "Client Representative"}</div>
        <div style="font-size: 11.5px; font-weight: 700; color: #1e3a8a; margin-top: 1px;">${q.client?.company || "Company Enterprise"}</div>
        ${q.client?.designation ? `<div style="font-size: 10px; color: #64748b; margin-top: 1px;">${q.client.designation}</div>` : ""}
        <div style="font-size: 10px; color: #334155; margin-top: 4px; line-height: 1.4;">
          Phone: <strong>${q.client?.phone || "N/A"}</strong> • Email: <strong>${q.client?.email || "N/A"}</strong>
        </div>
        ${q.client?.gstin ? `<div style="font-size: 10px; font-weight: 600; color: #334155; margin-top: 2px;">GSTIN: <strong>${q.client.gstin}</strong></div>` : ""}
        ${q.client?.billingAddress ? `<div style="font-size: 9.5px; color: #64748b; margin-top: 3px;">Billing Address: ${q.client.billingAddress}</div>` : ""}
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
        <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 5px; letter-spacing: 0.5px;">Machinery Scope & Parameters:</div>
        <div style="font-size: 13px; font-weight: 700; color: #0c1829;">${q.project?.title || "Turnkey Machinery Build"}</div>
        <div style="font-size: 11px; font-weight: 600; color: #1e3a8a; margin-top: 1px;">Category: ${q.project?.category || "Industrial Engineering"}</div>
        <div style="font-size: 10px; color: #334155; margin-top: 5px; line-height: 1.4;">
          Delivery Schedule: <strong>${q.commercialTerms?.deliveryTimeline || "8 – 12 Weeks"}</strong><br/>
          Installation Plant: <strong>${q.client?.plantLocation || "Customer Plant Works"}</strong>
        </div>
        ${q.project?.referenceDocName ? `<div style="font-size: 10px; color: #1e3a8a; margin-top: 3px; font-weight: 600;">📎 Drawing / Scope Ref: ${q.project.referenceDocName}</div>` : ""}
      </div>
    </div>

    <!-- Line Items Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10.5px;">
      <thead>
        <tr style="background: #0f172a; color: #ffffff;">
          <th style="padding: 7px 8px; text-align: center; width: 30px; font-size: 9.5px;">#</th>
          <th style="padding: 7px 8px; text-align: left; font-size: 9.5px;">Equipment Description & Technical Specifications</th>
          <th style="padding: 7px 8px; text-align: center; width: 60px; font-size: 9.5px;">HSN</th>
          <th style="padding: 7px 8px; text-align: right; width: 50px; font-size: 9.5px;">Qty</th>
          <th style="padding: 7px 8px; text-align: right; width: 95px; font-size: 9.5px;">Unit Rate (₹)</th>
          <th style="padding: 7px 8px; text-align: right; width: 50px; font-size: 9.5px;">GST %</th>
          <th style="padding: 7px 8px; text-align: right; width: 105px; font-size: 9.5px;">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${lineItems
          .map(
            (item, idx) => `
          <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? "#ffffff" : "#fcfcfd"};">
            <td style="padding: 7px 8px; text-align: center; color: #64748b; font-weight: 600;">${idx + 1}</td>
            <td style="padding: 7px 8px;">
              <div style="font-weight: 700; color: #0f172a;">${item.description}</div>
              ${item.discountPercent ? `<div style="font-size: 9px; color: #16a34a; font-weight: 600; margin-top: 1px;">• ${item.discountPercent}% Discount Applied</div>` : ""}
            </td>
            <td style="padding: 7px 8px; text-align: center; color: #475569; font-family: monospace;">${item.hsnCode || "8479"}</td>
            <td style="padding: 7px 8px; text-align: right; color: #0c1829; font-weight: 600;">${item.quantity} ${item.unit || "Nos"}</td>
            <td style="padding: 7px 8px; text-align: right; color: #334155;">${formatINR(item.unitPrice)}</td>
            <td style="padding: 7px 8px; text-align: right; color: #475569;">${item.taxPercent || 18}%</td>
            <td style="padding: 7px 8px; text-align: right; font-weight: 700; color: #1e3a8a;">${formatINR(item.amount)}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <!-- Totals and Words -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 12px; gap: 16px;">
      <div style="flex: 1;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
          <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: #64748b;">Amount in Words:</div>
          <div style="font-style: italic; font-weight: 700; color: #0c1829; font-size: 11px; margin-top: 3px; line-height: 1.4;">
            ${numberToIndianWords(q.grandTotal)}
          </div>
        </div>

        <div style="margin-top: 10px; font-size: 10px; color: #475569; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #ffffff;">
          <div style="font-weight: 700; text-transform: uppercase; color: #1e3a8a; font-size: 9px; margin-bottom: 3px;">Bank Wire Transfer Details:</div>
          <div>Beneficiary: <strong>THREE STAR ENTERPRISES</strong></div>
          <div>Bank: <strong>HDFC Bank Ltd</strong> • A/c No: <strong>50200084791234</strong></div>
          <div>IFSC: <strong>HDFC0001234</strong> • Branch: Chakan Industrial Area, Pune</div>
        </div>
      </div>

      <div style="width: 280px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; padding: 3px 0; color: #475569;">
          <span>Equipment Subtotal:</span>
          <span style="font-weight: 700; color: #0c1829;">${formatINR(q.subtotal)}</span>
        </div>
        ${
          q.discountTotal
            ? `<div style="display: flex; justify-content: space-between; padding: 3px 0; color: #16a34a;">
                <span>Total Discount:</span>
                <span style="font-weight: 700;">- ${formatINR(q.discountTotal)}</span>
              </div>`
            : ""
        }
        <div style="display: flex; justify-content: space-between; padding: 3px 0; color: #475569;">
          <span>Integrated GST (18%):</span>
          <span style="font-weight: 700; color: #0c1829;">${formatINR(q.taxTotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 2px solid #0f172a; margin-top: 8px; padding-top: 8px; font-size: 13.5px; font-weight: 800; color: #1e3a8a;">
          <span>Grand Total:</span>
          <span>${formatINR(q.grandTotal)}</span>
        </div>
      </div>
    </div>

    <!-- Commercial Terms -->
    <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 10px; background: #ffffff;">
      <div style="font-weight: 700; text-transform: uppercase; color: #1e3a8a; font-size: 10px; margin-bottom: 6px;">Commercial Terms & Conditions:</div>
      <ol style="margin: 0; padding-left: 18px; line-height: 1.5; color: #334155;">
        <li><strong>Payment Terms:</strong> ${q.commercialTerms?.paymentTerms || "30% Advance with PO, 60% against FAT trial in Pune, 10% after commissioning."}</li>
        <li><strong>Delivery Schedule:</strong> ${q.commercialTerms?.deliveryTimeline || "8 – 12 Weeks from drawing approval."}</li>
        <li><strong>Factory Acceptance Trials (FAT):</strong> ${q.commercialTerms?.inspectionFAT || "100% FAT trial & workpiece testing at Pune plant prior to dispatch."}</li>
        <li><strong>Warranty:</strong> ${q.commercialTerms?.warranty || "12 Months from commissioning / 18 months from dispatch date."}</li>
        <li><strong>Freight:</strong> ${q.commercialTerms?.freightTerms || "Ex-Works Pune Plant. Freight, transit insurance & packaging extra at actuals."}</li>
        <li><strong>Validity:</strong> Valid for ${q.commercialTerms?.validityDays || 30} Days from date of proposal.</li>
        ${q.commercialTerms?.specialNotes ? `<li><strong>Special Notes:</strong> ${q.commercialTerms.specialNotes}</li>` : ""}
      </ol>
    </div>

    <!-- Signatures -->
    <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; padding-top: 12px;">
      <div>
        <div style="color: #64748b;">Prepared by:</div>
        <div style="font-weight: 700; color: #0c1829; font-size: 11px; margin-top: 2px;">${q.preparedBy || "Three Star Enterprises Engineering Division"}</div>
        <div style="color: #64748b;">Pune Works Plant</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 700; color: #0c1829; font-size: 11px;">For THREE STAR ENTERPRISES</div>
        <div style="margin-top: 32px; border-top: 1.5px solid #0c1829; width: 180px; display: inline-block; padding-top: 4px; color: #475569; font-weight: 600;">
          Authorized Signatory
        </div>
      </div>
    </div>
  </div>`;
}

/**
 * General helper to export any element to PDF
 */
export async function downloadQuotationPDF(elementOrHtml: HTMLElement | string, filename: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const html2pdfModule: any = await import("html2pdf.js");
    const html2pdf: any = html2pdfModule.default || html2pdfModule;

    const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

    const opt = {
      margin: [6, 6, 6, 6],
      filename: cleanFilename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    await (html2pdf as any)().set(opt).from(elementOrHtml).save();
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    window.print();
    return false;
  }
}