import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, authenticated: isValidSession(request) });
}
