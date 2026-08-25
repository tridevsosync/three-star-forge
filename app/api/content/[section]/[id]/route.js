import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Content from "@/models/Content";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request, { params }) {
  try {
    const { section, id } = await params;
    await connectToDatabase();
    const record = await Content.findOne({ section }).lean();
    const item = Array.isArray(record?.data)
      ? record.data.find((entry) => entry.id === id || entry._id?.toString() === id)
      : null;
    if (!item)
      return NextResponse.json(
        { success: false, error: "Content item not found" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, data: { ...item, id: item.id || id } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch content item" },
      { status: 500 },
    );
  }
}

async function mutate(request, params, operation) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  try {
    const { section, id } = await params;
    await connectToDatabase();
    const record = await Content.findOne({ section });
    if (!record || !Array.isArray(record.data))
      return NextResponse.json(
        { success: false, error: "Content item not found" },
        { status: 404 },
      );
    const index = record.data.findIndex((entry) => entry.id === id || entry._id?.toString() === id);
    if (index < 0)
      return NextResponse.json(
        { success: false, error: "Content item not found" },
        { status: 404 },
      );
    const result = operation(record.data, index, await request.json().catch(() => ({})));
    if (result === null) record.data.splice(index, 1);
    else record.data[index] = { ...record.data[index], ...result, id: record.data[index].id || id };
    await record.save();
    return NextResponse.json({ success: true, data: result === null ? null : record.data[index] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update content" },
      { status: 500 },
    );
  }
}

export async function PUT(request, context) {
  return mutate(request, context.params, (_, __, body) => body);
}
export async function DELETE(request, context) {
  return mutate(request, context.params, () => null);
}
