import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { DEMO_GALLERY } from "@/data/site";

export async function POST() {
  try {
    await connectToDatabase();

    await Gallery.deleteMany({});
    const created = await Gallery.insertMany(
      DEMO_GALLERY.map((g: any, idx: number) => ({
        title: g.title,
        category: g.category,
        image: g.image,
        featured: Boolean(g.featured),
        order: idx,
      })),
    );

    return NextResponse.json({
      success: true,
      message: "Successfully seeded " + created.length + " demo photographs into MongoDB",
      count: created.length,
      data: created.map((c: any) => ({ ...c.toObject(), id: c._id.toString() })),
    });
  } catch (error: any) {
    console.error("MongoDB seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
