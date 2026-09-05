import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Quotation from "@/models/Quotation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    let item: any = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Quotation.findById(id).lean();
    }
    if (!item) {
      item = await Quotation.findOne({ $or: [{ quoteNumber: id }, { id }] }).lean();
    }

    if (!item) {
      return NextResponse.json({ success: false, error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { ...item, id: item._id?.toString() || item.id || id },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    if (Array.isArray(body.lineItems)) {
      let subtotal = 0;
      let discountTotal = 0;
      let taxTotal = 0;

      body.lineItems = body.lineItems.map((item: any) => {
        const qty = Number(item.quantity) || 1;
        const rate = Number(item.unitPrice) || 0;
        const discPct = Number(item.discountPercent) || 0;
        const taxPct = Number(item.taxPercent) ?? 18;

        const baseAmount = qty * rate;
        const discountAmount = (baseAmount * discPct) / 100;
        const taxableAmount = baseAmount - discountAmount;
        const itemTax = (taxableAmount * taxPct) / 100;
        const itemTotal = taxableAmount + itemTax;

        subtotal += baseAmount;
        discountTotal += discountAmount;
        taxTotal += itemTax;

        return {
          description: item.description || "Industrial Machinery Item",
          hsnCode: item.hsnCode || "8479",
          quantity: qty,
          unit: item.unit || "Nos",
          unitPrice: rate,
          discountPercent: discPct,
          taxPercent: taxPct,
          amount: Math.round(itemTotal * 100) / 100,
        };
      });

      body.subtotal = Math.round(subtotal * 100) / 100;
      body.discountTotal = Math.round(discountTotal * 100) / 100;
      body.taxTotal = Math.round(taxTotal * 100) / 100;
      body.grandTotal = Math.round((subtotal - discountTotal + taxTotal) * 100) / 100;
    }

    let updated: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Quotation.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true, runValidators: true },
      ).lean();
    }
    if (!updated) {
      updated = await Quotation.findOneAndUpdate(
        { $or: [{ quoteNumber: id }, { id }] },
        { $set: body },
        { new: true, runValidators: true },
      ).lean();
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Quotation updated successfully",
      data: { ...updated, id: updated._id?.toString() || updated.id || id },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    let deleted: any = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Quotation.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Quotation.findOneAndDelete({ $or: [{ quoteNumber: id }, { id }] });
    }

    return NextResponse.json({ success: true, message: "Quotation deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}