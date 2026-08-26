import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CREDENTIALS } from "@/data/site";

const COOKIE_NAME = "tse-admin-session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "three-star-local-session-secret";

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSessionToken(): string {
  const value = `admin:${Date.now()}`;
  return `${value}.${sign(value)}`;
}

export function isValidSession(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value || "";
  const [value, signature] = token.split(".");
  const expected = value ? sign(value) : "";
  const matches =
    signature &&
    expected &&
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return Boolean(value && matches && value.startsWith("admin:"));
}

export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!isValidSession(request)) {
    return NextResponse.json(
      { success: false, error: "Administrator authentication required" },
      { status: 401 },
    );
  }
  return null;
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

export function credentialsMatch(email?: string | null, password?: string | null): boolean {
  return (
    email?.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  );
}

export { COOKIE_NAME };
