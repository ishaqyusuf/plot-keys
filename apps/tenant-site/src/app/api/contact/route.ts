import { createLead, createPrismaClient } from "@plotkeys/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, subdomain } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      subdomain?: string;
    };

    if (
      !name?.trim() ||
      !email?.trim() ||
      !message?.trim() ||
      !subdomain?.trim()
    ) {
      return NextResponse.json(
        { error: "name, email, message, and subdomain are required." },
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

    await createLead(prisma, {
      companyId: company.id,
      email: email.trim(),
      message: message.trim(),
      name: name.trim(),
      phone: phone?.trim() || undefined,
      source: "contact_form",
    });

    // TODO: trigger email notification via Trigger.dev job

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 500 },
    );
  }
}
