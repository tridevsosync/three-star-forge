import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    let item: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Contact.findById(id).lean();
    }
    if (!item) {
      item = await Contact.findOne({ $or: [{ _id: id }, { id }] }).lean();
    }
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: { ...item, id: item._id?.toString() || item.id || id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    let updated: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Contact.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true, runValidators: true },
      ).lean();
    }
    if (!updated) {
      updated = await Contact.findOneAndUpdate(
        { $or: [{ _id: id }, { id }] },
        { $set: body },
        { new: true, runValidators: true },
      ).lean();
    }

    if (!updated) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      message: "Contact updated",
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
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Contact.findByIdAndDelete(id);
    } else {
      await Contact.deleteOne({ $or: [{ _id: id }, { id }] });
    }
    return NextResponse.json({ success: true, message: "Contact deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
