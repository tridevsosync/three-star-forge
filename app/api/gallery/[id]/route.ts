import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const item: any = await Gallery.findById(id).lean();

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { ...item, id: item._id.toString() },
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

    const existing: any = await Gallery.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    // If replacing with a new cloudinary image, clean up the old one
    if (body.cloudinaryPublicId && existing.cloudinaryPublicId && body.cloudinaryPublicId !== existing.cloudinaryPublicId) {
      await deleteFromCloudinary(existing.cloudinaryPublicId).catch(() => {});
    }

    const updated: any = await Gallery.findByIdAndUpdate(
      id,
      {
        title: body.title !== undefined ? body.title : existing.title,
        category: body.category !== undefined ? body.category : existing.category,
        image: body.image !== undefined ? body.image : existing.image,
        cloudinaryPublicId: body.cloudinaryPublicId !== undefined ? body.cloudinaryPublicId : existing.cloudinaryPublicId,
        description: body.description !== undefined ? body.description : existing.description,
        featured: body.featured !== undefined ? body.featured : existing.featured,
        order: body.order !== undefined ? body.order : existing.order,
      },
      { new: true, runValidators: true },
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Updated photograph successfully",
      data: { ...updated, id: updated._id.toString() },
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

    const item: any = await Gallery.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    if (item.cloudinaryPublicId) {
      await deleteFromCloudinary(item.cloudinaryPublicId).catch(() => {});
    }

    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Photograph deleted successfully",
    });
  } catch (error: any) {
    console.error("MongoDB delete item error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
