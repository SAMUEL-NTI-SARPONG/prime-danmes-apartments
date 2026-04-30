import { NextResponse } from "next/server";
import { sql, ensureTables } from "@/lib/db";
import { apartments } from "@/lib/data";

// POST — seed database with initial apartment data
export async function POST() {
  try {
    await ensureTables();

    const existing = await sql`SELECT count(*)::int AS count FROM "Apartment"`;
    if (existing[0].count > 0) {
      return NextResponse.json(
        { message: "Database already seeded", count: existing[0].count },
        { status: 200 },
      );
    }

    for (const apt of apartments) {
      await sql`
        INSERT INTO "Apartment" (
          id, name, type, price, "pricePeriod", "showPrice",
          image, images, beds, baths, sqft, floor,
          description, features, available, featured
        ) VALUES (
          ${apt.id},
          ${apt.name},
          ${apt.type},
          ${apt.price},
          ${apt.pricePeriod},
          ${apt.showPrice},
          ${apt.image},
          ${JSON.stringify(apt.images)},
          ${apt.beds},
          ${apt.baths},
          ${apt.sqft},
          ${apt.floor},
          ${apt.description},
          ${JSON.stringify(apt.features)},
          ${apt.available},
          ${apt.featured}
        )
      `;
    }

    return NextResponse.json(
      { message: "Seeded successfully", count: apartments.length },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
