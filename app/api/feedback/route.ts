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

// POST /api/feedback (Public submission)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { fullName, company, rating, category, message, avatarUrl, cloudinaryPublicId, type } = body;

    // Validate fields
    if (!fullName || !rating || !category || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name, star rating, machinery category, and review message are required.",
        },
        { status: 400 },
      );
    }

    if (fullName.trim().length > 80) {
      return NextResponse.json(
        { success: false, error: "Full name cannot exceed 80 characters." },
        { status: 400 },
      );
    }

    if (company && company.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: "Company name cannot exceed 100 characters." },
        { status: 400 },
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Review message must be at least 10 characters." },
        { status: 400 },
      );
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        { success: false, error: "Review message cannot exceed 500 characters." },
        { status: 400 },
      );
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be a valid number between 1 and 5 stars." },
        { status: 400 },
      );
    }

    const feedbackType = type === "general" ? "general" : "client";

    try {
      await connectToDatabase();
      const newFeedback = await Feedback.create({
        fullName: fullName.trim(),
        company: company ? company.trim() : "",
        rating: numericRating,
        category: category.trim(),
        message: message.trim(),
        avatarUrl: avatarUrl ? avatarUrl.trim() : "",
        cloudinaryPublicId: cloudinaryPublicId ? cloudinaryPublicId.trim() : "",
        type: feedbackType,
        isApproved: false,
        status: "pending",
        submittedDate: new Date(),
      });

      const normalized = {
        ...newFeedback.toObject(),
        id: newFeedback._id.toString(),
      };

      // Also append to local JSON for offline cache
      const list = getLocalFeedback();
      list.unshift(normalized);
      saveLocalFeedback(list);

      return NextResponse.json(
        {
          success: true,
          message: "Feedback submitted successfully. It will appear after admin review.",
          item: normalized,
        },
        { status: 201 },
      );
    } catch (dbError) {
      console.warn("MongoDB offline during feedback creation, falling back to local JSON:", dbError);
      const feedbackList = getLocalFeedback();
      const localId = `fb_local_${Date.now()}`;
      const newFeedback = {
        _id: localId,
        id: localId,
        fullName: fullName.trim(),
        company: company ? company.trim() : "",
        rating: numericRating,
        category: category.trim(),
        message: message.trim(),
        avatarUrl: avatarUrl ? avatarUrl.trim() : "",
        cloudinaryPublicId: cloudinaryPublicId ? cloudinaryPublicId.trim() : "",
        type: feedbackType,
        isApproved: false,
        status: "pending",
        submittedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      feedbackList.unshift(newFeedback);
      saveLocalFeedback(feedbackList);

      return NextResponse.json(
        {
          success: true,
          message: "Feedback submitted successfully. It will appear after admin review.",
          item: newFeedback,
        },
        { status: 201 },
      );
    }
  } catch (error: any) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit feedback." },
      { status: 500 },
    );
  }
}

// GET /api/feedback (Admin only - returns all feedback with status)
export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    try {
      await connectToDatabase();
      const feedbackList = await Feedback.find({}).sort({ submittedDate: -1, createdAt: -1 }).lean();
      const normalized = feedbackList.map((fb: any) => ({
        ...fb,
        id: fb._id ? fb._id.toString() : fb.id,
      }));
      return NextResponse.json({ success: true, count: normalized.length, data: normalized });
    } catch (dbError) {
      console.warn("MongoDB offline, reading feedback from local JSON:", dbError);
      const list = getLocalFeedback();
      list.sort(
        (a: any, b: any) =>
          new Date(b.submittedDate || b.createdAt).getTime() -
          new Date(a.submittedDate || a.createdAt).getTime(),
      );
      const normalized = list.map((fb: any) => ({
        ...fb,
        id: fb._id ? fb._id.toString() : fb.id,
      }));
      return NextResponse.json({ success: true, count: normalized.length, data: normalized });
    }
  } catch (error: any) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch feedback submissions." },
      { status: 500 },
    );
  }
}
