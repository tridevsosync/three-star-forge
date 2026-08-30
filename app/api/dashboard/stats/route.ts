import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Enquiry from "@/models/Enquiry";
import Project from "@/models/Project";
import Content from "@/models/Content";
import Feedback from "@/models/Feedback";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    await connectToDatabase();
    const [
      projects,
      content,
      enquiries,
      contacts,
      feedback,
      pendingFeedback,
      latestProject,
      latestContent,
    ] = await Promise.all([
      Project.countDocuments(),
      Content.countDocuments(),
      Enquiry.countDocuments(),
      Contact.countDocuments(),
      Feedback.countDocuments().catch(() => 0),
      Feedback.countDocuments({ $or: [{ isApproved: false }, { status: "pending" }] }).catch(() => 0),
      Project.findOne().sort({ updatedAt: -1 }).select("updatedAt").lean(),
      Content.findOne().sort({ updatedAt: -1 }).select("updatedAt").lean(),
    ]);
    return NextResponse.json({
      success: true,
      data: {
        projects,
        content,
        enquiries,
        contacts,
        feedback,
        pendingFeedback,
        lastProjectUpdated: (latestProject as any)?.updatedAt || null,
        lastContentUpdated: (latestContent as any)?.updatedAt || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
