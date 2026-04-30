import { NextRequest, NextResponse } from "next/server";
import { sql, ensureTables, bookingRef } from "@/lib/db";

// ─── Notification helpers (fire-and-forget, never fail the booking) ────────

async function sendWhatsAppNotification(phone: string, apiKey: string, message: string) {
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
    await fetch(url);
  } catch (e) {
    console.error(`WhatsApp notification to ${phone} failed:`, e);
  }
}

async function sendAdminEmail(params: Record<string, string>) {
  try {
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    if (!publicKey || publicKey === "YOUR_PUBLIC_KEY") return;
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_danmes",
        template_id: "template_booking_admin",
        user_id: publicKey,
        template_params: params,
      }),
    });
  } catch (e) {
    console.error("Admin email notification failed:", e);
  }
}

async function sendGuestEmail(params: Record<string, string>) {
  try {
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    if (!publicKey || publicKey === "YOUR_PUBLIC_KEY") return;
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_danmes",
        template_id: "template_booking",
        user_id: publicKey,
        template_params: params,
      }),
    });
  } catch (e) {
    console.error("Guest email notification failed:", e);
  }
}

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

    const id = bookingRef();
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

    // ── Fire notifications (non-blocking — do not await, never fail booking) ──
    const notifParams = {
      booking_ref:    booking.id,
      guest_name:     `${booking.firstName} ${booking.lastName}`,
      guest_email:    booking.email,
      guest_phone:    booking.phone,
      apartment_name: booking.apartment,
      check_in:       booking.moveInDate,
      lease_duration: booking.leaseDuration,
      occupants:      String(booking.occupants),
      purpose:        booking.employer,
      amount:         String(booking.amount),
      emergency_name: booking.emergencyName,
      emergency_phone:booking.emergencyPhone,
    };

    const waMessage =
      `🏠 NEW BOOKING — Prime Danmes Apartments\n\n` +
      `Ref: ${booking.id}\n` +
      `Guest: ${booking.firstName} ${booking.lastName}\n` +
      `Phone: ${booking.phone}\n` +
      `Email: ${booking.email}\n` +
      `Apartment: ${booking.apartment}\n` +
      `Check-in: ${booking.moveInDate}\n` +
      `Duration: ${booking.leaseDuration}\n` +
      `Guests: ${booking.occupants}\n` +
      `Purpose: ${booking.employer}\n` +
      `Amount: GHS ${booking.amount}\n\n` +
      `Emergency Contact: ${booking.emergencyName} — ${booking.emergencyPhone}`;

    const wa1Key = process.env.CALLMEBOT_API_KEY_1;
    const wa2Key = process.env.CALLMEBOT_API_KEY_2;
    if (wa1Key) sendWhatsAppNotification("233244893605", wa1Key, waMessage);
    if (wa2Key) sendWhatsAppNotification("12404756569",  wa2Key, waMessage);

    sendAdminEmail({ ...notifParams, to_email: "pdanmes@gmail.com" });
    sendGuestEmail({ ...notifParams, to_email: booking.email });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
