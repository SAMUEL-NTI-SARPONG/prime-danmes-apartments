import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionToken,
  isAdminConfigured,
  isAdminPasskeyValid,
} from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin access is not configured on this deployment." },
      { status: 503 },
    );
  }

  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0];
  const clientKey = forwardedFor || "local";
  const now = Date.now();
  const current = attempts.get(clientKey);
  if (current?.blockedUntil && current.blockedUntil > now) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait one minute and try again." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const passkey = typeof body.passkey === "string" ? body.passkey : "";
  if (!isAdminPasskeyValid(passkey)) {
    const nextCount = (current?.count || 0) + 1;
    attempts.set(clientKey, {
      count: nextCount >= MAX_ATTEMPTS ? 0 : nextCount,
      blockedUntil: nextCount >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0,
    });
    return NextResponse.json({ error: "Invalid passkey." }, { status: 401 });
  }

  attempts.delete(clientKey);
  (await cookies()).set(
    ADMIN_COOKIE_NAME,
    createAdminSessionToken(),
    adminCookieOptions,
  );
  return NextResponse.json({ authenticated: true });
}
