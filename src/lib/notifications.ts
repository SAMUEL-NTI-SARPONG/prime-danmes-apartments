import "server-only";

import type { BookingRecord } from "./repository";

export interface ManagerNotificationResult {
  configured: boolean;
  delivered: boolean;
  channels: Array<"email" | "whatsapp">;
}

function bookingMessage(booking: BookingRecord) {
  return [
    "NEW BOOKING — Prime Danmes Apartments",
    `Reference: ${booking.id}`,
    `Guest: ${booking.firstName} ${booking.lastName}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    `Apartment: ${booking.apartment}`,
    `Check-in: ${booking.moveInDate}`,
    `Duration: ${booking.leaseDuration}`,
    `Guests: ${booking.occupants}`,
    `Purpose: ${booking.employer}`,
    `Amount: GHS ${booking.amount}`,
    `Emergency contact: ${booking.emergencyName} — ${booking.emergencyPhone}`,
    booking.notes ? `Notes: ${booking.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendWeb3FormsEmail(booking: BookingRecord) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return false;
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New booking ${booking.id} — ${booking.apartment}`,
      from_name: "Prime Danmes Website",
      email: booking.email,
      "Booking reference": booking.id,
      Guest: `${booking.firstName} ${booking.lastName}`,
      Phone: booking.phone,
      Apartment: booking.apartment,
      "Check-in": booking.moveInDate,
      Duration: booking.leaseDuration,
      Occupants: booking.occupants,
      "Purpose of stay": booking.employer,
      "Emergency contact": `${booking.emergencyName} — ${booking.emergencyPhone}`,
      Notes: booking.notes || "None",
      message: bookingMessage(booking),
    }),
  });
  if (!response.ok) {
    throw new Error(`Web3Forms returned HTTP ${response.status}`);
  }
  const body = await response.json().catch(() => null);
  return body?.success !== false;
}

async function sendCallMeBot(
  booking: BookingRecord,
  phone: string | undefined,
  apiKey: string | undefined,
) {
  if (!phone || !apiKey) return false;
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone.replace(/\D/g, ""));
  url.searchParams.set("text", bookingMessage(booking));
  url.searchParams.set("apikey", apiKey);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`CallMeBot returned HTTP ${response.status}`);
  }
  return true;
}

export async function notifyManagerOfBooking(
  booking: BookingRecord,
): Promise<ManagerNotificationResult> {
  const configured = Boolean(
    process.env.WEB3FORMS_ACCESS_KEY ||
      (process.env.MANAGER_WHATSAPP_1 && process.env.CALLMEBOT_API_KEY_1) ||
      (process.env.MANAGER_WHATSAPP_2 && process.env.CALLMEBOT_API_KEY_2),
  );
  const attempts = await Promise.allSettled([
    sendWeb3FormsEmail(booking),
    sendCallMeBot(
      booking,
      process.env.MANAGER_WHATSAPP_1,
      process.env.CALLMEBOT_API_KEY_1,
    ),
    sendCallMeBot(
      booking,
      process.env.MANAGER_WHATSAPP_2,
      process.env.CALLMEBOT_API_KEY_2,
    ),
  ]);
  const channels: ManagerNotificationResult["channels"] = [];
  if (attempts[0].status === "fulfilled" && attempts[0].value) {
    channels.push("email");
  }
  if (
    (attempts[1].status === "fulfilled" && attempts[1].value) ||
    (attempts[2].status === "fulfilled" && attempts[2].value)
  ) {
    channels.push("whatsapp");
  }
  for (const attempt of attempts) {
    if (attempt.status === "rejected") {
      console.error("Booking notification failed:", attempt.reason);
    }
  }
  return { configured, delivered: channels.length > 0, channels };
}
