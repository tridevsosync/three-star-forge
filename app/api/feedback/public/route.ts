import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export const dynamic = "force-dynamic";

const localFilePath = path.join(process.cwd(), "src/data/feedback.json");

function getLocalApprovedFeedback(typeFilter?: string): any[] {
  if (!fs.existsSync(localFilePath)) {
    return [];
  }
  try {
    const fileData = fs.readFileSync(localFilePath, "utf8");
    const feedbackList = JSON.parse(fileData);
    return feedbackList.filter((fb: any) => {
      if (!fb.isApproved && fb.status !== "approved") return false;
      if (typeFilter) {
        return fb.type === typeFilter;
      }
      return true;
    });
  } catch (e) {
    console.error("Failed to read local feedback JSON:", e);
    return [];
  }
}

// GET /api/feedback/public (Public - returns approved feedback items)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type");

    try {
      await connectToDatabase();
      const query: any = {
        $or: [{ isApproved: true }, { status: "approved" }],
      };
      if (typeFilter) {
        query.type = typeFilter;
      }

      const approvedList = await Feedback.find(query)
        .sort({ submittedDate: -1, createdAt: -1 })
        .lean();

      const normalized = approvedList.map((fb: any) => ({
        ...fb,
        id: fb._id ? fb._id.toString() : fb.id,
      }));

      return NextResponse.json({
        success: true,
        count: normalized.length,
        data: normalized,
      });
    } catch (dbError) {
      console.warn("MongoDB offline, reading approved feedback from local JSON:", dbError);
      const approvedList = getLocalApprovedFeedback(typeFilter || undefined);
      approvedList.sort(
        (a: any, b: any) =>
          new Date(b.submittedDate || b.createdAt).getTime() -
          new Date(a.submittedDate || a.createdAt).getTime(),
      );
      const normalized = approvedList.map((fb: any) => ({
        ...fb,
        id: fb._id ? fb._id.toString() : fb.id,
      }));

      return NextResponse.json({
        success: true,
        count: normalized.length,
        data: normalized,
      });
    }
  } catch (error: any) {
    console.error("GET /api/feedback/public error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch approved testimonials." },
      { status: 500 },
    );
  }
}
