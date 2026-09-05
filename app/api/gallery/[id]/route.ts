import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    let item: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Gallery.findById(id).lean();
    }
    if (!item) {
      item = await Gallery.findOne({ id }).lean();
    }

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
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

    let existing: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      existing = await Gallery.findById(id);
    }
    if (!existing) {
      existing = await Gallery.findOne({ id });
    }

    if (!existing) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    // If removing or replacing with a new cloudinary image, clean up the old one
    if (existing.cloudinaryPublicId && (!body.image || (body.cloudinaryPublicId && body.cloudinaryPublicId !== existing.cloudinaryPublicId))) {
      await deleteFromCloudinary(existing.cloudinaryPublicId).catch(() => {});
    }

    // If setting featuredInHero to true, un-feature other hero items
    if (body.featuredInHero) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Gallery.updateMany({ _id: { $ne: id } }, { featuredInHero: false });
      } else {
        await Gallery.updateMany({ id: { $ne: id } }, { featuredInHero: false });
      }
    }

    let updated: any = null;
    const updateData = {
      title: body.title !== undefined ? body.title : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      image: body.image !== undefined ? (body.image || "").trim() : existing.image,
      cloudinaryPublicId: body.image ? (body.cloudinaryPublicId !== undefined ? body.cloudinaryPublicId : existing.cloudinaryPublicId) : "",
      description: body.description !== undefined ? body.description : existing.description,
      featured: body.featured !== undefined ? body.featured : existing.featured,
      featuredInHero: body.featuredInHero !== undefined ? body.featuredInHero : existing.featuredInHero,
      order: body.order !== undefined ? body.order : existing.order,
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Gallery.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: false }).lean();
    }
    if (!updated) {
      updated = await Gallery.findOneAndUpdate({ id }, updateData, { returnDocument: "after", runValidators: false }).lean();
    }

    return NextResponse.json({
      success: true,
      message: "Updated photograph successfully",
      data: { ...updated, id: updated?._id?.toString() || updated?.id || id },
    });
  } catch (error: any) {
    console.error("MongoDB update item error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    let item: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Gallery.findById(id);
    }
    if (!item) {
      item = await Gallery.findOne({ id });
    }

    if (item && item.cloudinaryPublicId) {
      await deleteFromCloudinary(item.cloudinaryPublicId).catch(() => {});
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      await Gallery.findByIdAndDelete(id);
    } else {
      await Gallery.deleteOne({ id });
    }

    return NextResponse.json({
      success: true,
      message: "Photograph deleted successfully",
    });
  } catch (error: any) {
    console.error("MongoDB delete item error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
