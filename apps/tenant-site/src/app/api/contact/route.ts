import { createPrismaClient } from "@plotkeys/db";
import { createLead, findCompanyBySlug } from "@plotkeys/db/queries";
import { notificationDispatchHandler, triggerJob } from "@plotkeys/jobs";
import { notificationDispatchTask } from "@plotkeys/jobs/tasks";
import { NextResponse } from "next/server";
import { z } from "zod";

const contactRequestSchema = z.object({
  email: z.string().trim().email("A valid email address is required."),
  message: z.string().trim().min(1, "Message cannot be empty.").max(2000),
  name: z.string().trim().min(1, "Name is required.").max(120),
  phone: z.string().trim().optional(),
  subdomain: z.string().trim().min(1, "Subdomain is required."),
});

export async function POST(request: Request) {
  try {
    const parsed = contactRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid contact request.",
        },
        { status: 400 },
      );
    }

    const { email, message, name, phone, subdomain } = parsed.data;

    const prisma = createPrismaClient().db;
    if (!prisma) {
      return NextResponse.json(
        { error: "Service unavailable." },
        { status: 503 },
      );
    }

    const company = await findCompanyBySlug(prisma, subdomain);

    if (!company) {
      return NextResponse.json(
        { error: "Unknown workspace." },
        { status: 404 },
      );
    }

    const lead = await createLead(prisma, {
      companyId: company.id,
      email,
      message,
      name,
      phone: phone || undefined,
      source: "contact_form",
    });

    triggerJob(notificationDispatchTask, notificationDispatchHandler, {
      kind: "contact_form" as const,
      data: {
        companyId: company.id,
        email,
        leadId: lead.id,
        message,
        name,
        phone: phone || undefined,
      },
    }).catch(() => {
      // Notification delivery failures are non-blocking.
    });

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 500 },
    );
  }
}
