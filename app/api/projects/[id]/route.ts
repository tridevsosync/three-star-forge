import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    let project: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }
    if (!project) {
      project = await Project.findOne({ $or: [{ _id: id }, { id }, { title: id }] });
    }
    if (!project)
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: project.toJSON ? project.toJSON() : { ...project, id: project._id?.toString() || id } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { _id, id: bodyId, ...updateData } = body;
    let project: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findByIdAndUpdate(id, updateData, {
        returnDocument: "after",
        runValidators: false,
      });
    }
    if (!project) {
      project = await Project.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, updateData, {
        returnDocument: "after",
        runValidators: false,
      });
    }
    if (!project)
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: project.toJSON ? project.toJSON() : { ...project, id: project._id?.toString() || id } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Project.findByIdAndDelete(id);
    } else {
      await Project.deleteOne({ $or: [{ _id: id }, { id }, { title: id }] });
    }
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
