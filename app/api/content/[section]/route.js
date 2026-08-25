import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Content from "@/models/Content";
import { COMPANY, FAQS, HOME_CONTENT, INDUSTRIES, SERVICES, TESTIMONIALS } from "@/data/site";
import { requireAdmin } from "@/lib/admin-auth";

const defaults = {
  company: COMPANY,
  home: HOME_CONTENT,
  services: SERVICES,
  industries: INDUSTRIES,
  faqs: FAQS,
  testimonials: TESTIMONIALS,
};
const listSections = new Set(["services", "industries", "faqs", "testimonials"]);

function normalizeItems(data) {
  return Array.isArray(data)
    ? data.map((item) => ({ ...item, id: item.id || item._id?.toString() || crypto.randomUUID() }))
    : data;
}

export async function GET(request, { params }) {
  try {
    const { section } = await params;
    if (!(section in defaults))
      return NextResponse.json(
        { success: false, error: "Unknown content section" },
        { status: 404 },
      );
    await connectToDatabase();
    let record = await Content.findOne({ section });
    if (!record)
      record = await Content.create({ section, data: normalizeItems(defaults[section]) });
    return NextResponse.json({
      success: true,
      data: normalizeItems(record.data),
      updatedAt: record.updatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const { section } = await params;
    if (!listSections.has(section))
      return NextResponse.json(
        { success: false, error: "Only list sections support create" },
        { status: 400 },
      );
    await connectToDatabase();
    const body = await request.json();
    const record = await Content.findOneAndUpdate(
      { section },
      { $setOnInsert: { section, data: [] } },
      { new: true, upsert: true },
    );
    const item = { ...body, id: body.id || crypto.randomUUID() };
    record.data = [...(Array.isArray(record.data) ? record.data : []), item];
    await record.save();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create content" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const { section } = await params;
    if (!listSections.has(section))
      return NextResponse.json(
        { success: false, error: "Only list sections support bulk delete" },
        { status: 400 },
      );
    await connectToDatabase();
    const record = await Content.findOne({ section });
    const deletedCount = Array.isArray(record?.data) ? record.data.length : 0;
    await Content.findOneAndUpdate(
      { section },
      { section, data: [] },
      { upsert: true, new: true, runValidators: true },
    );
    return NextResponse.json({ success: true, deletedCount });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete content" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const { section } = await params;
    if (!(section in defaults) || listSections.has(section))
      return NextResponse.json(
        { success: false, error: "Only single-record sections support update" },
        { status: 400 },
      );
    await connectToDatabase();
    const record = await Content.findOneAndUpdate(
      { section },
      { section, data: await request.json() },
      { new: true, upsert: true, runValidators: true },
    );
    return NextResponse.json({ success: true, data: record.data, updatedAt: record.updatedAt });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update content" },
      { status: 500 },
    );
  }
}
