import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CREDENTIALS } from "@/data/site";

const COOKIE_NAME = "tse-admin-session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "three-star-local-session-secret";

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSessionToken(email: string = ""): string {
  const cleanEmail = (email || process.env.ADMIN_EMAIL || ADMIN_CREDENTIALS.email || "").trim().toLowerCase();
  const value = `admin:${cleanEmail}:${Date.now()}`;
  return `${value}.${sign(value)}`;
}

export function isValidSession(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value || "";
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return false;
  const value = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const expected = value ? sign(value) : "";
  const matches =
    signature &&
    expected &&
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return Boolean(value && matches && value.startsWith("admin:"));
}

export function getSessionEmail(request: NextRequest): string {
  const defaultEmail = process.env.ADMIN_EMAIL || ADMIN_CREDENTIALS.email || "pandeytushar287@gmail.com";
  const token = request.cookies.get(COOKIE_NAME)?.value || "";
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return defaultEmail;
  const value = token.slice(0, dotIndex);
  const parts = value.split(":");
  if (parts.length >= 3 && parts[1].includes("@")) {
    return parts[1];
  }
  return defaultEmail;
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
  const envEmail = (process.env.ADMIN_EMAIL || ADMIN_CREDENTIALS.email || "").trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD || ADMIN_CREDENTIALS.password || "";
  return Boolean(
    email &&
    password &&
    email.trim().toLowerCase() === envEmail &&
    password === envPassword
  );
}

export { COOKIE_NAME };
