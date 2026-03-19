import { createPrismaClient, recordAnalyticsEvent } from "@plotkeys/db";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subdomain, eventType, path, propertyId, meta } = body as {
      subdomain?: string;
      eventType?: string;
      path?: string;
      propertyId?: string;
      meta?: Record<string, unknown>;
    };

    if (!subdomain?.trim() || !eventType?.trim()) {
      return NextResponse.json(
        { error: "subdomain and eventType are required." },
        { status: 400 },
      );
    }

    const prisma = createPrismaClient().db;
    if (!prisma) {
      return NextResponse.json(
        { error: "Service unavailable." },
        { status: 503 },
      );
    }

    const company = await prisma.company.findFirst({
      select: { id: true },
      where: { deletedAt: null, slug: subdomain },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Unknown workspace." },
        { status: 404 },
      );
    }

    // Derive a privacy-safe visitor fingerprint from IP + user-agent
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const ua = request.headers.get("user-agent") ?? "";
    const visitorId = crypto
      .createHash("sha256")
      .update(`${ip}:${ua}`)
      .digest("hex")
      .slice(0, 16);

    await recordAnalyticsEvent(prisma, {
      companyId: company.id,
      eventType: eventType.trim(),
      meta,
      path: path?.trim(),
      propertyId,
      referrer: request.headers.get("referer") ?? undefined,
      userAgent: ua,
      visitorId,
    });

    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 500 },
    );
  }
}
