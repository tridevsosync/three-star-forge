import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectToDatabase();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    const normalized = contacts.map((c: any) => ({
      ...c,
      id: c._id ? c._id.toString() : c.id,
    }));
    return NextResponse.json({ success: true, count: normalized.length, data: normalized });
  } catch (error: any) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, phone, company, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, "");
      if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid phone number (7 to 15 digits)." },
          { status: 400 },
        );
      }
    }

    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      company: company ? company.trim() : "",
      subject: subject ? subject.trim() : "General Inquiry",
      message: message.trim(),
    });

    const result = {
      ...newContact.toObject(),
      id: newContact._id.toString(),
    };

    return NextResponse.json(
      { success: true, message: "Contact message sent successfully.", data: result },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create contact error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { ids } = body;

    if (Array.isArray(ids) && ids.length > 0) {
      await Contact.deleteMany({ _id: { $in: ids } });
      return NextResponse.json({ success: true, message: `Deleted ${ids.length} contacts` });
    }

    await Contact.deleteMany({});
    return NextResponse.json({ success: true, message: "Cleared all contact messages" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
