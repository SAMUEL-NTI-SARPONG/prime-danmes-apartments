import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  createContactRecord,
  listContactRecords,
} from "@/lib/repository";

async function notifyManager(record: Awaited<ReturnType<typeof createContactRecord>>) {
  if (!process.env.WEB3FORMS_ACCESS_KEY) return;
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      subject: `Website enquiry: ${record.subject}`,
      from_name: "Prime Danmes Website",
      email: record.email,
      Name: `${record.firstName} ${record.lastName}`,
      Phone: record.phone || "Not provided",
      message: record.message,
    }),
  });
  if (!response.ok) {
    throw new Error(`Web3Forms returned HTTP ${response.status}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    for (const field of ["firstName", "lastName", "email", "subject", "message"]) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }
    const record = await createContactRecord({
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: body.phone ? String(body.phone).trim() : "",
      subject: String(body.subject).trim(),
      message: String(body.message).trim(),
    });
    await notifyManager(record).catch((error) =>
      console.error("Contact notification failed:", error),
    );
    return NextResponse.json({ success: true, id: record.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await listContactRecords());
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
