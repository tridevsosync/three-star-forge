import crypto from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_CREDENTIALS } from "@/data/site";

const COOKIE_NAME = "tse-admin-session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "three-star-local-session-secret";

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSessionToken() {
  const value = `admin:${Date.now()}`;
  return `${value}.${sign(value)}`;
}

export function isValidSession(request) {
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

export function requireAdmin(request) {
  if (!isValidSession(request)) {
    return NextResponse.json(
      { success: false, error: "Administrator authentication required" },
      { status: 401 },
    );
  }
  return null;
}

export function sessionCookie(token) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

export function credentialsMatch(email, password) {
  return (
    email?.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  );
}

export { COOKIE_NAME };
