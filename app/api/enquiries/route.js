import { NextResponse } from "next/server";

// In-memory demo store
const enquiries = [
  {
    id: "enq-1",
    name: "John Miller",
    company: "Apex Precision Engineering",
    email: "j.miller@apexeng.com",
    phone: "+91 98234 56789",
    industry: "Industrial Automation",
    requirement: "Turnkey induction hardening machine line automation",
    message: "Interested in discussing customized fixture design and cycle time optimization.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: enquiries.length,
    data: enquiries,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, industry, requirement, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and message are required fields.",
        },
        { status: 400 },
      );
    }

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name,
      company: company || "",
      email,
      phone: phone || "",
      industry: industry || "General",
      requirement: requirement || "",
      message,
      createdAt: new Date().toISOString(),
    };

    enquiries.unshift(newEnquiry);

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        data: newEnquiry,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON payload.",
      },
      { status: 400 },
    );
  }
}
