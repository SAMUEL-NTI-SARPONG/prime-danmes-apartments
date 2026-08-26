import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createApartment, listApartments } from "@/lib/repository";

export async function GET() {
  try {
    return NextResponse.json(await listApartments());
  } catch (error) {
    console.error("GET /api/apartments error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    for (const field of ["name", "type"]) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }
    const apartment = await createApartment({
      id: body.id,
      name: String(body.name).trim(),
      type: body.type,
      price: Number(body.price || 0),
      pricePeriod: body.pricePeriod || "per month",
      showPrice: Boolean(body.showPrice),
      image: String(body.image || ""),
      images: Array.isArray(body.images) ? body.images.map(String) : [],
      beds: Number(body.beds || 1),
      baths: Number(body.baths || 1),
      sqft: Number(body.sqft || 0),
      floor: Number(body.floor || 1),
      description: String(body.description || ""),
      features: Array.isArray(body.features) ? body.features.map(String) : [],
      available: body.available ?? true,
      featured: body.featured ?? false,
    });
    return NextResponse.json(apartment, { status: 201 });
  } catch (error) {
    console.error("POST /api/apartments error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
