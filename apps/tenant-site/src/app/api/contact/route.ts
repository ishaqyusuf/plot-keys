import { createPrismaClient } from "@plotkeys/db";
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

    if (!name?.trim() || !email?.trim() || !message?.trim() || !subdomain?.trim()) {
      return NextResponse.json(
        { error: "name, email, message, and subdomain are required." },
        { status: 400 },
      );
    }

    // Validate subdomain resolves to a known company.
    const prisma = createPrismaClient().db;
    if (prisma) {
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
    }

    // TODO: trigger email notification / CRM hook via Trigger.dev job

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
