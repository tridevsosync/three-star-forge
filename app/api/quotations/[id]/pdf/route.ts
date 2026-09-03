import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quotation from "@/models/Quotation";
import { generateQuotationPDFDocument } from "@/lib/pdfExport";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    let quote = await Quotation.findById(id).lean();
    if (!quote) {
      quote = await Quotation.findOne({ quoteNumber: id }).lean();
    }

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quotation not found" },
        { status: 404 }
      );
    }

    const normalizedQuote: any = {
      ...quote,
      id: (quote as any)._id ? (quote as any)._id.toString() : (quote as any).id,
    };

    const doc = await generateQuotationPDFDocument(normalizedQuote);
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Failed to generate PDF document" },
        { status: 500 }
      );
    }

    const arrayBuffer = doc.output("arraybuffer");
    const pdfBuffer = Buffer.from(arrayBuffer);

    const quoteNo = (normalizedQuote.quoteNumber || "Quotation").replace(/[\/\\]/g, "-");
    const company = (normalizedQuote.client?.company || "Client")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_");
    const filename = `Quotation-${quoteNo}-${company}.pdf`;

    const { searchParams } = new URL(request.url);
    const isInline = searchParams.get("view") === "1" || searchParams.get("inline") === "1";

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${isInline ? "inline" : "attachment"}; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("API PDF generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}