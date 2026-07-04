import type { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";

export type NotificationMessageLogChannel =
  | "email"
  | "in_app"
  | "phone"
  | "sms"
  | "whatsapp";

export type CreateNotificationMessageLogInput = {
  body: string;
  channel: NotificationMessageLogChannel;
  companyId: string;
  customerId?: string | null;
  errorDetails?: Prisma.InputJsonValue | null;
  leadId?: string | null;
  provider?: string | null;
  providerId?: string | null;
  recipient: string;
  sentAt?: Date | null;
  status?: string;
  subject?: string | null;
};

export type NotificationMessageLogSummary = {
  id: string;
  provider: string | null;
  providerId: string | null;
  sentAt: Date | null;
  status: string;
};

export async function createNotificationMessageLog(
  db: Db,
  input: CreateNotificationMessageLogInput,
) {
  const errorDetails =
    input.errorDetails === undefined || input.errorDetails === null
      ? null
      : JSON.stringify(input.errorDetails);

  await db.$executeRaw`
    INSERT INTO notification_message_logs (
      id,
      company_id,
      customer_id,
      lead_id,
      channel,
      recipient,
      subject,
      body,
      provider,
      provider_id,
      error_details,
      status,
      sent_at
    )
    VALUES (
      gen_random_uuid(),
      CAST(${input.companyId} AS uuid),
      CAST(${input.customerId ?? null} AS uuid),
      CAST(${input.leadId ?? null} AS uuid),
      ${input.channel},
      ${input.recipient},
      ${input.subject ?? null},
      ${input.body},
      ${input.provider ?? null},
      ${input.providerId ?? null},
      CAST(${errorDetails} AS jsonb),
      ${input.status ?? "draft"},
      CAST(${input.sentAt ?? null} AS timestamptz)
    )
  `;
}

export async function findLatestNotificationMessageLog(
  db: Db,
  input: {
    channel?: NotificationMessageLogChannel;
    companyId: string;
    leadId?: string | null;
  },
): Promise<NotificationMessageLogSummary | null> {
  if (input.leadId && input.channel) {
    const rows = await db.$queryRaw<NotificationMessageLogSummary[]>`
      SELECT
        id::text AS "id",
        provider,
        provider_id AS "providerId",
        sent_at AS "sentAt",
        status
      FROM notification_message_logs
      WHERE company_id = CAST(${input.companyId} AS uuid)
        AND lead_id = CAST(${input.leadId} AS uuid)
        AND channel = ${input.channel}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    return rows[0] ?? null;
  }

  const rows = await db.$queryRaw<NotificationMessageLogSummary[]>`
    SELECT
      id::text AS "id",
      provider,
      provider_id AS "providerId",
      sent_at AS "sentAt",
      status
    FROM notification_message_logs
    WHERE company_id = CAST(${input.companyId} AS uuid)
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return rows[0] ?? null;
}
