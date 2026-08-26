import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { notifyManagerOfBooking } from "@/lib/notifications";
import {
  createBookingRecord,
  listApartments,
  listBookings,
} from "@/lib/repository";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await listBookings());
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "ghanaCard",
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

    const email = String(body.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    const ghanaCard = String(body.ghanaCard).trim().toUpperCase();
    if (!/^GHA-\d{9}-\d$/.test(ghanaCard)) {
      return NextResponse.json(
        { error: "Ghana Card must use the format GHA-123456789-0" },
        { status: 400 },
      );
    }
    const moveInDate = String(body.moveInDate).trim();
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(moveInDate) || moveInDate < today) {
      return NextResponse.json(
        { error: "Check-in date cannot be in the past" },
        { status: 400 },
      );
    }

    const apartment = (await listApartments()).find(
      (item) => item.id === String(body.apartmentId),
    );
    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }
    if (!apartment.available) {
      return NextResponse.json(
        { error: "This apartment is currently unavailable" },
        { status: 409 },
      );
    }

    const booking = await createBookingRecord({
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email,
      phone: String(body.phone).trim(),
      ghanaCard,
      apartment: apartment.name,
      apartmentId: apartment.id,
      moveInDate,
      leaseDuration: String(body.leaseDuration).trim(),
      occupants: String(body.occupants).trim(),
      employer: String(body.employer).trim(),
      emergencyName: String(body.emergencyName).trim(),
      emergencyPhone: String(body.emergencyPhone).trim(),
      notes: body.notes ? String(body.notes).trim() : "",
      amount: apartment.price,
    });

    const notification = await notifyManagerOfBooking(booking);
    return NextResponse.json({ ...booking, notification }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: "We could not submit your booking. Please try again." },
      { status: 500 },
    );
  }
}
