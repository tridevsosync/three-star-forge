import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const project = await Project.findById((await params).id);
    if (!project)
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: project.toJSON() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    await connectToDatabase();
    const project = await Project.findByIdAndUpdate((await params).id, await request.json(), {
      new: true,
      runValidators: true,
    });
    if (!project)
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: project.toJSON() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    await connectToDatabase();
    const project = await Project.findByIdAndDelete((await params).id);
    if (!project)
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
