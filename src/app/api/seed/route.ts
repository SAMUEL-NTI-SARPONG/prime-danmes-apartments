import { NextResponse } from "next/server";
import { apartments } from "@/lib/data";
import { isAdminRequest } from "@/lib/admin-auth";
import { createApartment, listApartments } from "@/lib/repository";

export async function POST() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const existing = await listApartments();
    if (existing.length > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        count: existing.length,
      });
    }
    for (const apartment of apartments) {
      await createApartment(apartment);
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
