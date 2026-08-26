import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  createMaintenanceRecord,
  listMaintenance,
} from "@/lib/repository";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await listMaintenance());
  } catch (error) {
    console.error("GET /api/maintenance error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    for (const field of ["apartment", "apartmentId", "issue", "priority"]) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }
    const validPriorities = ["low", "medium", "high", "urgent"] as const;
    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }
    const record = await createMaintenanceRecord({
      apartment: String(body.apartment).trim(),
      apartmentId: String(body.apartmentId).trim(),
      issue: String(body.issue).trim(),
      priority: body.priority,
      reportedDate:
        body.reportedDate || new Date().toISOString().slice(0, 10),
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("POST /api/maintenance error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
