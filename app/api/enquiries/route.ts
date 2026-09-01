import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function GET() {
  try {
    await connectToDatabase();
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
    const normalized = enquiries.map((e: any) => ({
      ...e,
      id: e._id ? e._id.toString() : e.id,
    }));
    return NextResponse.json({ success: true, count: normalized.length, data: normalized });
  } catch (error: any) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      location,
      industry,
      machineType,
      requirement,
      timeline,
      targetVolume,
      message,
      referenceProject,
      referenceDocument,
      referenceDocumentName,
      referenceDocumentSize,
      priority,
    } = body;

    if (!name || !email || !phone || !company || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, phone, company, and project scope are required fields." },
        { status: 400 },
      );
    }

    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, "");
    if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid phone or mobile number (7 to 15 digits)." },
        { status: 400 },
      );
    }

    const newEnquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      location: location ? location.trim() : "",
      industry: industry ? industry.trim() : "Industrial Automation",
      machineType: machineType ? machineType.trim() : "Induction Hardening Machine",
      requirement: requirement ? requirement.trim() : "Turnkey Machine Manufacturing",
      timeline: timeline ? timeline.trim() : "1 - 3 Months",
      targetVolume: targetVolume ? targetVolume.trim() : "",
      message: message.trim(),
      referenceProject: referenceProject ? referenceProject.trim() : "",
      referenceDocument: referenceDocument ? referenceDocument.trim() : "",
      referenceDocumentName: referenceDocumentName ? referenceDocumentName.trim() : "",
      referenceDocumentSize: referenceDocumentSize ? referenceDocumentSize.trim() : "",
      priority: priority || "standard",
    });

    const result = {
      ...newEnquiry.toObject(),
      id: newEnquiry._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Quotation request (RFQ) received successfully. Reference ID: " + result.id.slice(-6).toUpperCase(),
        data: result,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create enquiry error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { ids } = body;

    if (Array.isArray(ids) && ids.length > 0) {
      await Enquiry.deleteMany({ _id: { $in: ids } });
      return NextResponse.json({ success: true, message: `Deleted ${ids.length} quotation enquiries` });
    }

    await Enquiry.deleteMany({});
    return NextResponse.json({ success: true, message: "Cleared all quotation enquiries" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
