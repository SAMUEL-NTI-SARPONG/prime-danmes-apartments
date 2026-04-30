import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables } from "@/lib/db";

// PATCH — update booking status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTables();
    const { id } = await params;
    const body = await req.json();

    const validStatuses = [
      "pending",
      "confirmed",
      "checked-in",
      "completed",
      "cancelled",
    ];

    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (body.status) {
      await sql`UPDATE "Booking" SET status = ${body.status} WHERE id = ${id}`;
    }

    const [booking] = await sql`SELECT * FROM "Booking" WHERE id = ${id}`;
    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE booking
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTables();
    const { id } = await params;
    await sql`DELETE FROM "Booking" WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
