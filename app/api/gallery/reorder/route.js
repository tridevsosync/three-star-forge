import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Items array required" }, { status: 400 });
    }

    const updates = items.map((item, index) => 
      Gallery.findByIdAndUpdate(item.id || item._id, { order: typeof item.order === "number" ? item.order : index })
    );

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("MongoDB reorder error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
