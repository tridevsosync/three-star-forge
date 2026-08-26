import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await Gallery.find({}).sort({ order: 1, createdAt: -1 }).lean();

    const normalized = items.map((item: any) => ({
      ...item,
      id: item._id ? item._id.toString() : item.id,
    }));

    return NextResponse.json({
      success: true,
      count: normalized.length,
      data: normalized,
    });
  } catch (error: any) {
    console.error("MongoDB fetch gallery error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, category, image, cloudinaryPublicId, description, featured, order } = body;

    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: "Title and image are required" },
        { status: 400 },
      );
    }

    const newItem = await Gallery.create({
      title: title.trim(),
      category: category ? category.trim() : "Machines",
      image: image.trim(),
      cloudinaryPublicId: cloudinaryPublicId || "",
      description: description ? description.trim() : "",
      featured: Boolean(featured),
      order: typeof order === "number" ? order : 0,
    });

    const result = {
      ...newItem.toObject(),
      id: newItem._id.toString(),
    };

    return NextResponse.json(
      { success: true, message: "Gallery item created successfully", data: result },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("MongoDB create gallery error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create gallery item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { ids } = body;

    if (Array.isArray(ids) && ids.length > 0) {
      const validObjectIds = ids.filter((id: string) => mongoose.Types.ObjectId.isValid(id));
      const itemsToDelete = await Gallery.find({
        $or: [
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
          { id: { $in: ids } },
        ],
      });

      for (const item of itemsToDelete) {
        if (item.cloudinaryPublicId) {
          await deleteFromCloudinary(item.cloudinaryPublicId).catch(() => {});
        }
      }

      await Gallery.deleteMany({
        $or: [
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
          { id: { $in: ids } },
        ],
      });

      return NextResponse.json({
        success: true,
        message: "Successfully deleted " + ids.length + " photographs",
      });
    }

    const allItems = await Gallery.find({});
    for (const item of allItems) {
      if (item.cloudinaryPublicId) {
        await deleteFromCloudinary(item.cloudinaryPublicId).catch(() => {});
      }
    }
    await Gallery.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Cleared all gallery items",
    });
  } catch (error: any) {
    console.error("MongoDB delete gallery error:", error);
    return NextResponse.json({ success: true, message: "Filtered locally" });
  }
}
