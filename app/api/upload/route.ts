import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { image, folder } = body;

      if (!image) {
        return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 });
      }

      const result = await uploadToCloudinary(image, folder || "three-star-forge/gallery");
      return NextResponse.json({
        success: true,
        url: result?.secure_url,
        public_id: result?.public_id,
        width: result?.width,
        height: result?.height,
        format: result?.format,
      });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "three-star-forge/gallery";

      if (!file) {
        return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const result = await uploadToCloudinary(base64, folder);
      return NextResponse.json({
        success: true,
        url: result?.secure_url,
        public_id: result?.public_id,
        width: result?.width,
        height: result?.height,
        format: result?.format,
      });
    }

    return NextResponse.json({ success: false, error: "Unsupported content type" }, { status: 400 });
  } catch (error: any) {
    console.error("Cloudinary upload API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image to Cloudinary" },
      { status: 500 },
    );
  }
}
