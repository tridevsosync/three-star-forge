import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
import { requireAdmin } from "@/lib/admin-auth";

const localFilePath = path.join(process.cwd(), "src/data/feedback.json");

function getLocalFeedback(): any[] {
  if (!fs.existsSync(localFilePath)) {
    return [];
  }
  try {
    const fileData = fs.readFileSync(localFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (e) {
    console.error("Failed to read local feedback JSON:", e);
    return [];
  }
}

function saveLocalFeedback(feedbackList: any[]): boolean {
  try {
    const dir = path.dirname(localFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localFilePath, JSON.stringify(feedbackList, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to save local feedback JSON:", e);
    return false;
  }
}

// PATCH /api/feedback/[id] (Admin only - toggles approval status or updates fields)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    try {
      await connectToDatabase();
      const item = await Feedback.findById(id);

      if (item) {
        if (typeof body.isApproved === "boolean") {
          item.isApproved = body.isApproved;
          item.status = body.isApproved ? "approved" : "pending";
        } else {
          item.isApproved = !item.isApproved;
          item.status = item.isApproved ? "approved" : "pending";
        }

        if (body.rating) item.rating = Number(body.rating);
        if (body.message) item.message = body.message;
        if (body.fullName) item.fullName = body.fullName;
        if (body.company !== undefined) item.company = body.company;

        await item.save();

        const normalized = {
          ...item.toObject(),
          id: item._id.toString(),
        };

        // Also update local JSON if present
        const list = getLocalFeedback();
        const idx = list.findIndex((fb) => fb._id === id || fb.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...normalized };
          saveLocalFeedback(list);
        }

        return NextResponse.json({ success: true, item: normalized });
      }
    } catch (dbError) {
      console.warn("MongoDB offline, toggling approval in local JSON:", dbError);
    }

    // Local JSON fallback
    const feedbackList = getLocalFeedback();
    const item = feedbackList.find((fb) => fb._id === id || fb.id === id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Feedback submission not found" },
        { status: 404 },
      );
    }

    if (typeof body.isApproved === "boolean") {
      item.isApproved = body.isApproved;
      item.status = body.isApproved ? "approved" : "pending";
    } else {
      item.isApproved = !item.isApproved;
      item.status = item.isApproved ? "approved" : "pending";
    }

    if (body.rating) item.rating = Number(body.rating);
    if (body.message) item.message = body.message;
    if (body.fullName) item.fullName = body.fullName;
    if (body.company !== undefined) item.company = body.company;

    saveLocalFeedback(feedbackList);
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("PATCH /api/feedback/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update feedback." },
      { status: 500 },
    );
  }
}

// DELETE /api/feedback/[id] (Admin only - deletes feedback)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;

    try {
      await connectToDatabase();
      const deleted = await Feedback.findByIdAndDelete(id);
      if (deleted) {
        // Also remove from local JSON if present
        let list = getLocalFeedback();
        list = list.filter((fb) => fb._id !== id && fb.id !== id);
        saveLocalFeedback(list);

        return NextResponse.json({ success: true, message: "Feedback deleted successfully" });
      }
    } catch (dbError) {
      console.warn("MongoDB offline, deleting from local JSON:", dbError);
    }

    // Local JSON fallback
    let feedbackList = getLocalFeedback();
    const exists = feedbackList.some((fb) => fb._id === id || fb.id === id);

    if (!exists) {
      return NextResponse.json(
        { success: false, error: "Feedback submission not found" },
        { status: 404 },
      );
    }

    feedbackList = feedbackList.filter((fb) => fb._id !== id && fb.id !== id);
    saveLocalFeedback(feedbackList);

    return NextResponse.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/feedback/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete feedback." },
      { status: 500 },
    );
  }
}
