import { createPrismaClient, type Db } from "@plotkeys/db";
import { createNotificationMessageLog } from "@plotkeys/db/queries";
import {
  createUserNotificationContact,
  type DeliverySummary,
  type EmailInput,
  EmailService,
  type EmailSendResult,
  Notifications,
  type NotificationResult,
  type NotificationTaskPayload,
  notificationTaskPayloadSchema,
  type PlotKeysNotificationType,
} from "@plotkeys/notifications";
import { buildDashboardUrl, buildTenantDashboardUrl } from "@plotkeys/utils";
import { z } from "zod";

export const contactFormPayloadSchema = z.object({
  companyId: z.string(),
  email: z.string().trim().email(),
  leadId: z.string().optional(),
  message: z.string().trim().min(1),
  name: z.string().trim().min(1),
  phone: z.string().optional(),
});

export const propertyInquiryPayloadSchema = z.object({
  companyId: z.string(),
  email: z.string().trim().email(),
  leadId: z.string().optional(),
  message: z.string().optional(),
  name: z.string().trim().min(1),
  phone: z.string().optional(),
  propertyId: z.string().optional(),
});

export const newsletterSignupPayloadSchema = z.object({
  companyId: z.string(),
  email: z.string().trim().email(),
  name: z.string().optional(),
});

export const notificationDispatchPayloadSchema = z.discriminatedUnion("kind", [
  z.object({ data: contactFormPayloadSchema, kind: z.literal("contact_form") }),
  z.object({
    data: notificationTaskPayloadSchema,
    kind: z.literal("notification"),
  }),
  z.object({
    data: propertyInquiryPayloadSchema,
    kind: z.literal("property_inquiry"),
  }),
  z.object({
    data: newsletterSignupPayloadSchema,
    kind: z.literal("newsletter_signup"),
  }),
]);

export type ContactFormPayload = z.infer<typeof contactFormPayloadSchema>;
export type PropertyInquiryPayload = z.infer<
  typeof propertyInquiryPayloadSchema
>;
export type NewsletterSignupPayload = z.infer<
  typeof newsletterSignupPayloadSchema
>;
export type NotificationDispatchPayload = z.infer<
  typeof notificationDispatchPayloadSchema
>;

export type NotificationDispatchResult = {
  activities?: number;
  dispatches: NotificationResult["dispatches"];
  kind: NotificationDispatchPayload["kind"];
  skippedChannels: Array<{ channel: string; reason: string }>;
  type?: PlotKeysNotificationType;
};

function getDashboardAppUrl() {
  return buildDashboardUrl();
}

function emptySummary() {
  return {
    failed: 0,
    sent: 0,
    skipped: 0,
  };
}

function mergeSummary(...summaries: DeliverySummary[]): DeliverySummary {
  return summaries.reduce(
    (result, summary) => ({
      failed: result.failed + summary.failed,
      sent: result.sent + summary.sent,
      skipped: result.skipped + summary.skipped,
    }),
    emptySummary(),
  );
}

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function emailRecipients(email: EmailInput) {
  return Array.isArray(email.to) ? email.to : [email.to];
}

async function logLegacyEmailDispatch(
  db: Db,
  input: {
    companyId: string;
    email: EmailInput;
    result: EmailSendResult;
  },
) {
  const { email, result } = input;
  const recipient =
    result.recipients.join(", ") ||
    result.originalRecipients.join(", ") ||
    emailRecipients(email).join(", ");

  await createNotificationMessageLog(db, {
    body: email.html ?? email.body ?? "",
    channel: "email",
    companyId: input.companyId,
    errorDetails: result.error
      ? { error: errorMessage(result.error) }
      : result.wasRecipientOverridden
        ? {
            originalRecipients: result.originalRecipients,
            testEmailOverride: true,
          }
        : undefined,
    provider: "resend",
    providerId: result.providerId ?? null,
    recipient,
    sentAt: result.status === "sent" ? new Date() : null,
    status: result.status,
    subject: email.subject,
  });
}

async function getCompanyOwnerContext(db: Db, companyId: string) {
  const company = await db.company.findUnique({
    select: { id: true, name: true, slug: true },
    where: { id: companyId },
  });
  const ownerMembership = await db.membership.findFirst({
    include: { user: true },
    where: {
      companyId,
      deletedAt: null,
      role: "owner",
    },
  });

  if (!company || !ownerMembership?.user) {
    return null;
  }

  const owner = ownerMembership.user;
  const ownerName = owner.name ?? owner.email;

  return {
    company,
    ownerName,
    ownerRecipient: createUserNotificationContact({
      displayName: ownerName,
      email: owner.email,
      phoneNumber: owner.phoneNumber ?? undefined,
      userId: owner.id,
    }),
  };
}

export async function notificationHandler(
  input: NotificationTaskPayload,
  _attempt: number,
): Promise<NotificationDispatchResult> {
  const { db } = createPrismaClient();
  if (!db) {
    return {
      dispatches: {
        email: emptySummary(),
        inApp: emptySummary(),
        phone: emptySummary(),
        sms: emptySummary(),
        whatsapp: emptySummary(),
      },
      kind: "notification",
      skippedChannels: [{ channel: "all", reason: "Database unavailable." }],
      type: input.type,
    };
  }

  const result = await new Notifications(db).send(
    input.type,
    input.companyId,
    input.payload as never,
    {
      channels: input.channels,
      recipients: input.recipients,
      sendEmail: input.sendEmail ?? false,
    },
  );

  return {
    ...result,
    kind: "notification",
    type: input.type,
  };
}

export async function notificationDispatchHandler(
  payload: NotificationDispatchPayload,
  _attempt: number,
): Promise<NotificationDispatchResult> {
  if (payload.kind === "notification") {
    return notificationHandler(payload.data, _attempt);
  }

  const { db } = createPrismaClient();
  if (!db) {
    return {
      dispatches: {
        email: emptySummary(),
        inApp: emptySummary(),
        phone: emptySummary(),
        sms: emptySummary(),
        whatsapp: emptySummary(),
      },
      kind: payload.kind,
      skippedChannels: [{ channel: "all", reason: "Database unavailable." }],
    };
  }

  const context = await getCompanyOwnerContext(db, payload.data.companyId);

  if (!context) {
    return {
      dispatches: {
        email: emptySummary(),
        inApp: emptySummary(),
        phone: emptySummary(),
        sms: emptySummary(),
        whatsapp: emptySummary(),
      },
      kind: payload.kind,
      skippedChannels: [
        { channel: "all", reason: "Company owner recipient not found." },
      ],
    };
  }

  const { company, ownerName, ownerRecipient } = context;
  const notifications = new Notifications(db);
  const dashboardUrl = buildTenantDashboardUrl(company.slug, {
    currentOrigin: getDashboardAppUrl(),
    pathname: "/leads",
  });

  switch (payload.kind) {
    case "contact_form": {
      const result = await notifications.send(
        "new_lead_captured",
        company.id,
        {
          companyName: company.name,
          dashboardUrl,
          fullName: ownerName,
          leadEmail: payload.data.email,
          leadId: payload.data.leadId,
          leadMessage: payload.data.message,
          leadName: payload.data.name,
        },
        {
          channels: ["email", "in_app", "whatsapp"],
          recipients: [ownerRecipient],
          sendEmail: true,
        },
      );

      return {
        ...result,
        kind: payload.kind,
      };
    }

    case "property_inquiry": {
      const leadMessage = [
        payload.data.message,
        payload.data.propertyId
          ? `Property reference: ${payload.data.propertyId}`
          : null,
      ]
        .filter(Boolean)
        .join("\n\n");
      const result = await notifications.send(
        "new_lead_captured",
        company.id,
        {
          companyName: company.name,
          dashboardUrl,
          fullName: ownerName,
          leadEmail: payload.data.email,
          leadId: payload.data.leadId,
          leadMessage,
          leadName: payload.data.name,
        },
        {
          channels: ["email", "in_app", "whatsapp"],
          recipients: [ownerRecipient],
          sendEmail: true,
        },
      );
      const receiptEmail = {
        body: [
          `Hi ${payload.data.name},`,
          "",
          `Thanks for your inquiry with ${company.name}. We received your message and the team will follow up soon.`,
          payload.data.propertyId
            ? `Property reference: ${payload.data.propertyId}`
            : "",
        ]
          .filter((line) => line !== "")
          .join("\n"),
        subject: `We received your inquiry for ${company.name}`,
        to: payload.data.email,
      } satisfies EmailInput;
      const receipt = await new EmailService().send(receiptEmail);
      await logLegacyEmailDispatch(db, {
        companyId: company.id,
        email: receiptEmail,
        result: receipt,
      });

      return {
        dispatches: {
          ...result.dispatches,
          email: mergeSummary(result.dispatches.email, {
            failed: receipt.status === "failed" ? 1 : 0,
            sent: receipt.status === "sent" ? 1 : 0,
            skipped: receipt.status === "skipped" ? 1 : 0,
          }),
        },
        kind: payload.kind,
        skippedChannels: result.skippedChannels,
      };
    }

    case "newsletter_signup": {
      const result = await notifications.send(
        "subscriber_lead_created",
        company.id,
        {
          description: `${payload.data.email} subscribed from the tenant site.`,
        },
        {
          channels: ["in_app"],
          recipients: [ownerRecipient],
        },
      );
      const welcomeEmail = {
        body: [
          `Hi ${payload.data.name ?? "there"},`,
          "",
          `Thanks for subscribing to updates from ${company.name}.`,
        ].join("\n"),
        subject: `You're subscribed to ${company.name}`,
        to: payload.data.email,
      } satisfies EmailInput;
      const welcome = await new EmailService().send(welcomeEmail);
      await logLegacyEmailDispatch(db, {
        companyId: company.id,
        email: welcomeEmail,
        result: welcome,
      });

      return {
        dispatches: {
          ...result.dispatches,
          email: mergeSummary(result.dispatches.email, {
            failed: welcome.status === "failed" ? 1 : 0,
            sent: welcome.status === "sent" ? 1 : 0,
            skipped: welcome.status === "skipped" ? 1 : 0,
          }),
        },
        kind: payload.kind,
        skippedChannels: result.skippedChannels,
      };
    }
  }
}
