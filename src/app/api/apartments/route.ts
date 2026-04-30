import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables, cuid } from "@/lib/db";

// GET all apartments
export async function GET() {
  try {
    await ensureTables();
    const rows = await sql`SELECT * FROM "Apartment" ORDER BY name ASC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/apartments error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST new apartment
export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();

    const required = ["name", "type"];
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const id = body.id || cuid();

    const [row] = await sql`
      INSERT INTO "Apartment" (
        id, name, type, price, "pricePeriod", "showPrice",
        image, images, beds, baths, sqft, floor,
        description, features, available, featured
      ) VALUES (
        ${id},
        ${String(body.name).trim()},
        ${String(body.type).trim()},
        ${typeof body.price === "number" ? body.price : 0},
        ${body.pricePeriod || "per month"},
        ${body.showPrice ?? false},
        ${body.image || ""},
        ${JSON.stringify(body.images || [])},
        ${body.beds ?? 1},
        ${body.baths ?? 1},
        ${body.sqft ?? 0},
        ${body.floor ?? 1},
        ${body.description || ""},
        ${JSON.stringify(body.features || [])},
        ${body.available ?? true},
        ${body.featured ?? false}
      ) RETURNING *
    `;

    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("POST /api/apartments error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
