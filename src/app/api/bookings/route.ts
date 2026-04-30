import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables, cuid } from "@/lib/db";

// GET all bookings
export async function GET() {
  try {
    await ensureTables();
    const bookings =
      await sql`SELECT * FROM "Booking" ORDER BY "createdAt" DESC`;
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST new booking
export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();

    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "ghanaCard",
      "apartment",
      "apartmentId",
      "moveInDate",
      "leaseDuration",
      "occupants",
      "employer",
      "emergencyName",
      "emergencyPhone",
    ];

    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const id = cuid();
    const amount = typeof body.amount === "number" ? body.amount : 0;

    const [booking] = await sql`
      INSERT INTO "Booking" (
        id, "firstName", "lastName", email, phone, "ghanaCard",
        apartment, "apartmentId", "moveInDate", "leaseDuration", occupants,
        employer, "emergencyName", "emergencyPhone", notes, status, amount
      ) VALUES (
        ${id},
        ${String(body.firstName).trim()},
        ${String(body.lastName).trim()},
        ${String(body.email).trim()},
        ${String(body.phone).trim()},
        ${String(body.ghanaCard).trim()},
        ${String(body.apartment).trim()},
        ${String(body.apartmentId).trim()},
        ${String(body.moveInDate).trim()},
        ${String(body.leaseDuration).trim()},
        ${String(body.occupants).trim()},
        ${String(body.employer).trim()},
        ${String(body.emergencyName).trim()},
        ${String(body.emergencyPhone).trim()},
        ${body.notes ? String(body.notes).trim() : ""},
        'pending',
        ${amount}
      ) RETURNING *
    `;

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
