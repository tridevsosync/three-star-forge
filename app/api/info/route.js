import { NextResponse } from "next/server";
import { COMPANY } from "@/data/site";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: COMPANY,
  });
}
