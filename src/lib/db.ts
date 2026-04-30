import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import crypto from "crypto";

// Neon is stateless HTTP — create a fresh function per invocation context
export function getSQL(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set");
  return neon(url);
}

// Named export that lazy-evaluates on first use
export function sql(...args: Parameters<NeonQueryFunction<false, false>>) {
  return getSQL()(...args);
}

export function cuid(): string {
  return crypto.randomBytes(12).toString("hex");
}

/** Generates a human-readable booking reference, e.g. PDA-20260430-A4F2C3 */
export function bookingRef(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `PDA-${y}${m}${d}-${suffix}`;
}

// Track initialization per process lifetime — reset on failure so retries work
let _initialized = false;

export async function ensureTables() {
  if (_initialized) return;
  try {
    const sql = getSQL();

    await sql`
    CREATE TABLE IF NOT EXISTS "Apartment" (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      type          TEXT NOT NULL,
      price         NUMERIC NOT NULL DEFAULT 0,
      "pricePeriod" TEXT NOT NULL DEFAULT 'per month',
      "showPrice"   BOOLEAN NOT NULL DEFAULT false,
      image         TEXT NOT NULL DEFAULT '',
      images        JSONB NOT NULL DEFAULT '[]',
      beds          INTEGER NOT NULL DEFAULT 1,
      baths         INTEGER NOT NULL DEFAULT 1,
      sqft          INTEGER NOT NULL DEFAULT 0,
      floor         INTEGER NOT NULL DEFAULT 1,
      description   TEXT NOT NULL DEFAULT '',
      features      JSONB NOT NULL DEFAULT '[]',
      available     BOOLEAN NOT NULL DEFAULT true,
      featured      BOOLEAN NOT NULL DEFAULT false,
      "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS "Booking" (
      id               TEXT PRIMARY KEY,
      "firstName"      TEXT NOT NULL,
      "lastName"       TEXT NOT NULL,
      email            TEXT NOT NULL,
      phone            TEXT NOT NULL,
      "ghanaCard"      TEXT NOT NULL,
      apartment        TEXT NOT NULL,
      "apartmentId"    TEXT NOT NULL,
      "moveInDate"     TEXT NOT NULL,
      "leaseDuration"  TEXT NOT NULL,
      occupants        TEXT NOT NULL,
      employer         TEXT NOT NULL,
      "emergencyName"  TEXT NOT NULL,
      "emergencyPhone" TEXT NOT NULL,
      notes            TEXT NOT NULL DEFAULT '',
      status           TEXT NOT NULL DEFAULT 'pending',
      amount           NUMERIC NOT NULL DEFAULT 0,
      "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS "Maintenance" (
      id             TEXT PRIMARY KEY,
      apartment      TEXT NOT NULL,
      "apartmentId"  TEXT NOT NULL,
      issue          TEXT NOT NULL,
      priority       TEXT NOT NULL DEFAULT 'medium',
      status         TEXT NOT NULL DEFAULT 'open',
      "reportedDate" TEXT NOT NULL DEFAULT '',
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS "ContactMessage" (
      id           TEXT PRIMARY KEY,
      "firstName"  TEXT NOT NULL,
      "lastName"   TEXT NOT NULL,
      email        TEXT NOT NULL,
      phone        TEXT NOT NULL DEFAULT '',
      subject      TEXT NOT NULL,
      message      TEXT NOT NULL,
      "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

    _initialized = true;
  } catch (err) {
    // Reset so the next request retries table initialization
    _initialized = false;
    throw err;
  }
}
