import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables } from "@/lib/db";

// PATCH — update maintenance status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTables();
    const { id } = await params;
    const body = await req.json();

    const validStatuses = ["open", "in-progress", "resolved"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (body.status) {
      await sql`UPDATE "Maintenance" SET status = ${body.status} WHERE id = ${id}`;
    }

    const [row] = await sql`SELECT * FROM "Maintenance" WHERE id = ${id}`;
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (error) {
    console.error("PATCH /api/maintenance/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE maintenance request
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTables();
    const { id } = await params;
    await sql`DELETE FROM "Maintenance" WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/maintenance/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
