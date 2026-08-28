import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { PROJECTS } from "@/data/site";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    await connectToDatabase();
    let projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    if (!projects || projects.length === 0) {
      const seeded = await Project.insertMany(
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
      projects = seeded.map((s: any) => s.toObject());
    }
    return NextResponse.json({
      success: true,
      data: projects.map((project: any) => ({
        ...project,
        id: (project._id || project.id)?.toString(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    await connectToDatabase();
    const result = await Project.deleteMany({});
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, industry, category, image } = body;
    if (!title || !industry || !category)
      return NextResponse.json(
        { success: false, error: "Title, industry, and category are required" },
        { status: 400 },
      );
    const project = await Project.create({
      ...body,
      title: title.trim(),
      industry: industry.trim(),
      category: category.trim(),
      image: (image || "").trim(),
    });
    return NextResponse.json({ success: true, data: project.toJSON() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create project" },
      { status: 500 },
    );
  }
}
