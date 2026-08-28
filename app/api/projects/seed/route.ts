import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { PROJECTS } from "@/data/site";

export async function POST() {
  try {
    await connectToDatabase();

    await Project.deleteMany({});
    const created = await Project.insertMany(
      PROJECTS.map((p: any) => ({
        title: p.title,
        industry: p.industry,
        category: p.category,
        image: p.image,
        description: p.description,
        challenge: p.challenge,
        solution: p.solution,
        features: p.features || [],
        specifications: p.specifications || {},
        gallery: p.gallery || [],
        results: p.results || [],
        scope: p.scope || [],
        timeline: p.timeline || "",
        status: p.status || "Completed",
      })),
    );

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${created.length} projects into MongoDB`,
      count: created.length,
      data: created.map((c: any) => ({ ...c.toObject(), id: c._id.toString() })),
    });
  } catch (error: any) {
    console.error("MongoDB projects seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
