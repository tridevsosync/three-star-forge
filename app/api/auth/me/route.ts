import { NextRequest, NextResponse } from "next/server";
import { isValidSession, getSessionEmail } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authenticated = isValidSession(request);
  const email = authenticated ? getSessionEmail(request) : null;
  return NextResponse.json({ success: true, authenticated, email });
}
