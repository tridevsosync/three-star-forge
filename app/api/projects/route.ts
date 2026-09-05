import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
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

export async function DELETE(_request: NextRequest) {
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
