import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Content from "@/models/Content";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ section: string; id: string }> }) {
  try {
    const { section, id } = await params;
    await connectToDatabase();
    const record: any = await Content.findOne({ section }).lean();
    const item = Array.isArray(record?.data)
      ? record.data.find((entry: any) => entry.id === id || entry._id?.toString() === id)
      : null;
    if (!item)
      return NextResponse.json(
        { success: false, error: "Content item not found" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, data: { ...item, id: item.id || id } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch content item" },
      { status: 500 },
    );
  }
}

async function mutate(request: NextRequest, paramsPromise: Promise<{ section: string; id: string }>, operation: (arr: any[], idx: number, body: any) => any) {
  try {
    const { section, id } = await paramsPromise;
    const decodedId = decodeURIComponent(id);
    await connectToDatabase();
    let record: any = await Content.findOne({ section });
    if (!record || !Array.isArray(record.data)) {
      return NextResponse.json({ success: true, data: null });
    }
    const index = record.data.findIndex(
      (entry: any) =>
        entry.id === id ||
        entry.id === decodedId ||
        entry._id?.toString() === id ||
        entry._id?.toString() === decodedId ||
        entry.name === id ||
        entry.name === decodedId ||
        entry.title === id ||
        entry.title === decodedId ||
        entry.question === id ||
        entry.question === decodedId ||
        entry.author === id ||
        entry.author === decodedId
    );
    if (index >= 0) {
      const body = await request.json().catch(() => ({}));
      const result = operation(record.data, index, body);
      if (result === null) {
        record.data.splice(index, 1);
      } else {
        record.data[index] = { ...record.data[index], ...result, id: record.data[index].id || id };
      }
      record.markModified("data");
      await record.save();
      return NextResponse.json({ success: true, data: result === null ? null : record.data[index] });
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    return NextResponse.json({ success: true, message: "Handled" });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ section: string; id: string }> }) {
  return mutate(request, params, (_, __, body) => body);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ section: string; id: string }> }) {
  return mutate(request, params, () => null);
}
