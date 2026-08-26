import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "danmes_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const DEVELOPMENT_PASSKEY = "danmes2026#admin";

function getAdminPasskey() {
  const configured = process.env.ADMIN_PASSKEY;
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return DEVELOPMENT_PASSKEY;
  return null;
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSKEY ||
    (process.env.NODE_ENV !== "production" ? DEVELOPMENT_PASSKEY : null)
  );
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function sign(expiresAt: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function isAdminConfigured() {
  return Boolean(getAdminPasskey() && getSessionSecret());
}

export function isAdminPasskeyValid(candidate: string) {
  const passkey = getAdminPasskey();
  return Boolean(passkey && safeEqual(candidate, passkey));
}

export function createAdminSessionToken() {
  const secret = getSessionSecret();
  if (!secret) throw new Error("Admin authentication is not configured");
  const expiresAt = String(
    Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  );
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;
  const [expiresAt, signature, ...extra] = token.split(".");
  if (!expiresAt || !signature || extra.length > 0) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(expiresAt, secret));
}

export async function isAdminRequest() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
