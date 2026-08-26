import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/repository";
import { defaultSiteSettings, type SiteSettings } from "@/lib/site-settings";

const settingKeys = Object.keys(defaultSiteSettings) as Array<keyof SiteSettings>;

export async function GET() {
  try {
    return NextResponse.json(await getSiteSettings());
  } catch (error) {
    console.error("GET /api/site-settings error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const updates: Partial<SiteSettings> = {};
    for (const key of settingKeys) {
      if (key in body) updates[key] = String(body[key] ?? "").trim();
    }

    const required: Array<keyof SiteSettings> = [
      "addressLine1",
      "addressLine2",
      "gpsAddress",
      "phone1",
      "whatsapp1",
      "email",
    ];
    const merged = { ...(await getSiteSettings()), ...updates };
    const missing = required.find((key) => !merged[key]);
    if (missing) {
      return NextResponse.json(
        { error: `${missing} is required` },
        { status: 400 },
      );
    }
    if (!/^\S+@\S+\.\S+$/.test(merged.email)) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 },
      );
    }
    if (merged.mapEmbedUrl) {
      const mapUrl = new URL(merged.mapEmbedUrl);
      if (mapUrl.protocol !== "https:") {
        return NextResponse.json(
          { error: "The map embed URL must use HTTPS" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(await updateSiteSettings(updates));
  } catch (error) {
    console.error("PATCH /api/site-settings error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save settings" },
      { status: 400 },
    );
  }
}
