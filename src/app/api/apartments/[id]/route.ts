import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables } from "@/lib/db";

// PATCH — update apartment fields (read-merge-write)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTables();
    const { id } = await params;
    const body = await req.json();

    const [existing] = await sql`SELECT * FROM "Apartment" WHERE id = ${id}`;
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const name = body.name ?? existing.name;
    const type = body.type ?? existing.type;
    const price = body.price ?? existing.price;
    const pricePeriod = body.pricePeriod ?? existing.pricePeriod;
    const showPrice = body.showPrice ?? existing.showPrice;
    const image = body.image ?? existing.image;
    const images = body.images
      ? JSON.stringify(body.images)
      : JSON.stringify(existing.images);
    const beds = body.beds ?? existing.beds;
    const baths = body.baths ?? existing.baths;
    const sqft = body.sqft ?? existing.sqft;
    const floor = body.floor ?? existing.floor;
    const description = body.description ?? existing.description;
    const features = body.features
      ? JSON.stringify(body.features)
      : JSON.stringify(existing.features);
    const available = body.available ?? existing.available;
    const featured = body.featured ?? existing.featured;

    const [updated] = await sql`
      UPDATE "Apartment" SET
        name = ${name},
        type = ${type},
        price = ${price},
        "pricePeriod" = ${pricePeriod},
        "showPrice" = ${showPrice},
        image = ${image},
        images = ${images},
        beds = ${beds},
        baths = ${baths},
        sqft = ${sqft},
        floor = ${floor},
        description = ${description},
        features = ${features},
        available = ${available},
        featured = ${featured}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/apartments/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE apartment
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTables();
    const { id } = await params;
    await sql`DELETE FROM "Apartment" WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/apartments/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
