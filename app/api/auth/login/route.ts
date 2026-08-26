import { NextRequest, NextResponse } from "next/server";
import { credentialsMatch, createSessionToken, sessionCookie } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!credentialsMatch(email, password)) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }

  const authenticatedEmail = (email || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const response = NextResponse.json({ success: true, email: authenticatedEmail });
  response.cookies.set(sessionCookie(createSessionToken(authenticatedEmail)));
  return response;
}
