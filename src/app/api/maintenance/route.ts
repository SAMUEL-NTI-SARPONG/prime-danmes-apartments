import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables, cuid } from "@/lib/db";

// GET all maintenance requests
export async function GET() {
  try {
    await ensureTables();
    const rows =
      await sql`SELECT * FROM "Maintenance" ORDER BY "createdAt" DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/maintenance error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST new maintenance request
export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();

    const required = ["apartment", "apartmentId", "issue", "priority"];
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }

    const id = cuid();
    const reportedDate =
      body.reportedDate || new Date().toISOString().slice(0, 10);

    const [row] = await sql`
      INSERT INTO "Maintenance" (
        id, apartment, "apartmentId", issue, priority, status, "reportedDate"
      ) VALUES (
        ${id},
        ${String(body.apartment).trim()},
        ${String(body.apartmentId).trim()},
        ${String(body.issue).trim()},
        ${body.priority},
        'open',
        ${reportedDate}
      ) RETURNING *
    `;

    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("POST /api/maintenance error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
