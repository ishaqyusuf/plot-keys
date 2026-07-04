import { createPrismaClient } from "@plotkeys/db";
import { findLatestNotificationMessageLog } from "@plotkeys/db/queries";
import {
  createSubscriberNotificationContact,
  Notifications,
  type NotificationResult,
} from "@plotkeys/notifications";
import { buildDashboardUrl, buildTenantDashboardUrl } from "@plotkeys/utils";
import { z } from "zod";

export const emailSmokeTestPayloadSchema = z.object({
  email: z.string().trim().email(),
});

export type EmailSmokeTestPayload = z.infer<
  typeof emailSmokeTestPayloadSchema
>;

export type EmailSmokeTestResult = {
  companyId: string;
  leadId: string;
  messageLog: {
    id: string;
    provider: string | null;
    providerId: "set" | null;
    sentAt: Date | null;
    status: string;
  } | null;
  recipient: string;
  result: NotificationResult;
  timestamp: string;
};

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return "invalid-email";
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

export async function emailSmokeTestHandler(
  input: EmailSmokeTestPayload,
): Promise<EmailSmokeTestResult> {
  const email = input.email.trim();

  if (!email) {
    throw new Error("email is required for the email smoke test.");
  }

  const timestamp = new Date().toISOString();
  const db = createPrismaClient().db;

  if (!db) {
    throw new Error("database is required for the email smoke test.");
  }

  const suffix = Date.now().toString(36);
  const company = await db.company.create({
    data: {
      name: "PlotKeys email smoke test",
      slug: `email-smoke-test-${suffix}`,
    },
    select: { id: true, name: true, slug: true },
  });
  const lead = await db.lead.create({
    data: {
      companyId: company.id,
      email,
      message: `Created by Trigger.dev email smoke test at ${timestamp}`,
      name: "PlotKeys email smoke test",
      source: "email_smoke_test",
    },
    select: { id: true },
  });
  const dashboardUrl = buildTenantDashboardUrl(company.slug, {
    currentOrigin: buildDashboardUrl(),
    pathname: "/leads",
  });
  const result = await new Notifications(db).send(
    "new_lead_captured",
    company.id,
    {
      companyName: company.name,
      dashboardUrl,
      fullName: "PlotKeys email smoke test",
      leadEmail: email,
      leadId: lead.id,
      leadMessage: `Production email smoke test at ${timestamp}`,
      leadName: "PlotKeys email smoke test",
    },
    {
      channels: ["email"],
      recipients: [
        createSubscriberNotificationContact({
          displayName: "PlotKeys email smoke test",
          email,
          subscriberId: lead.id,
          topic: "email-smoke-test",
        }),
      ],
      sendEmail: true,
    },
  );
  const messageLog = await findLatestNotificationMessageLog(db, {
    channel: "email",
    companyId: company.id,
    leadId: lead.id,
  });

  return {
    companyId: company.id,
    leadId: lead.id,
    messageLog: messageLog
      ? {
          ...messageLog,
          providerId: messageLog.providerId ? "set" : null,
        }
      : null,
    recipient: maskEmail(email),
    result,
    timestamp,
  };
}
