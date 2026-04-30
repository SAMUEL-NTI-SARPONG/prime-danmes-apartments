import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables, cuid } from "@/lib/db";

// POST — save a contact message
export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();

    const required = ["firstName", "lastName", "email", "subject", "message"];
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const id = cuid();

    await sql`
      INSERT INTO "ContactMessage" (
        id, "firstName", "lastName", email, phone, subject, message
      ) VALUES (
        ${id},
        ${String(body.firstName).trim()},
        ${String(body.lastName).trim()},
        ${String(body.email).trim()},
        ${body.phone ? String(body.phone).trim() : ""},
        ${String(body.subject).trim()},
        ${String(body.message).trim()}
      )
    `;

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// GET — list contact messages (admin use)
export async function GET() {
  try {
    await ensureTables();
    const rows =
      await sql`SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
