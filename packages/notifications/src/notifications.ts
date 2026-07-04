import type { Db } from "@plotkeys/db";
import {
  createNotification,
  createNotificationMessageLog,
} from "@plotkeys/db/queries";

import {
  createUserNotificationContact,
  type NotificationContact,
} from "./contacts";
import type {
  NotificationChannel,
  NotificationChannelDispatch,
  NotificationSkippedChannel,
} from "./core-types";
import {
  type DeliverySummary,
  type NotificationOptions,
  type NotificationResult,
} from "./base";
import { planNotificationDeliveries } from "./delivery";
import {
  createNotificationDispatchFromType,
  plotKeysNotificationTypes,
} from "./notification-types";
import type {
  PlotKeysNotificationType,
} from "./payload-utils";
import type { NotificationTypes } from "./schemas";
import {
  EmailService,
  supportsEmailNotificationType,
} from "./services/email-service";
import {
  supportsWhatsAppNotificationType,
  WhatsAppService,
} from "./services/whatsapp-service";

function notificationLink(actionId?: string) {
  if (!actionId) {
    return undefined;
  }

  return actionId.startsWith("/") || actionId.startsWith("http")
    ? actionId
    : undefined;
}

function recordFromPayload(payload: unknown) {
  return payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : {};
}

function stringField(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return typeof value === "string" ? value : undefined;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function recipientLabel(recipient: NotificationContact) {
  if (recipient.kind === "user") {
    return recipient.email ?? recipient.displayName ?? recipient.userId;
  }

  return recipient.email ?? recipient.displayName ?? recipient.subscriberId;
}

function phoneRecipient(recipient: NotificationContact) {
  return recipient.phoneNumber ?? recipient.email ?? recipientLabel(recipient);
}

function textMessageFromDispatch(dispatch: NotificationChannelDispatch) {
  const payload = recordFromPayload(dispatch.payload);
  const body = stringField(payload, "body");

  return body ?? dispatch.description ?? dispatch.title;
}

function supportsProviderChannel(
  notificationType: string,
  channel: NotificationChannel,
) {
  if (channel === "email") {
    return supportsEmailNotificationType(notificationType);
  }

  if (channel === "whatsapp") {
    return supportsWhatsAppNotificationType(notificationType);
  }

  return true;
}

function providerChannelSkipReason(
  notificationType: string,
  channel: NotificationChannel,
) {
  return `${notificationType} does not support ${channel} delivery.`;
}

export class Notifications {
  #db: Db;
  #emailService: EmailService;
  #whatsappService: WhatsAppService;

  constructor(db: Db) {
    this.#db = db;
    this.#emailService = new EmailService();
    this.#whatsappService = new WhatsAppService();
  }

  async #resolveDefaultRecipients(
    companyId: string,
  ): Promise<NotificationContact[]> {
    const ownerMembership = await this.#db.membership.findFirst({
      include: { user: true },
      where: {
        companyId,
        deletedAt: null,
        role: "owner",
      },
    });

    if (!ownerMembership?.user) {
      return [];
    }

    const owner = ownerMembership.user;

    return [
      createUserNotificationContact({
        displayName: owner.name ?? owner.email,
        email: owner.email,
        phoneNumber: owner.phoneNumber ?? undefined,
        userId: owner.id,
      }),
    ];
  }

  async #persistInAppNotifications(
    companyId: string,
    dispatches: NotificationChannelDispatch[],
  ): Promise<DeliverySummary> {
    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const dispatch of dispatches) {
      if (dispatch.channel !== "in_app") {
        skipped += 1;
        continue;
      }

      for (const recipient of dispatch.recipients) {
        const payload = recordFromPayload(dispatch.payload);
        const body = dispatch.description ?? dispatch.title;

        if (recipient.kind !== "user") {
          await createNotificationMessageLog(this.#db, {
            body,
            channel: "in_app",
            companyId,
            customerId: stringField(payload, "customerId"),
            leadId: stringField(payload, "leadId"),
            provider: null,
            recipient: recipientLabel(recipient),
            status: "skipped",
            subject: dispatch.title,
          });
          skipped += 1;
          continue;
        }

        try {
          await createNotification(this.#db, {
            body: dispatch.description,
            companyId,
            link: notificationLink(dispatch.action?.actionId),
            title: dispatch.title,
            type: dispatch.notificationType,
            userId: recipient.userId,
          });
          await createNotificationMessageLog(this.#db, {
            body,
            channel: "in_app",
            companyId,
            customerId: stringField(payload, "customerId"),
            leadId: stringField(payload, "leadId"),
            provider: null,
            recipient: recipientLabel(recipient),
            sentAt: new Date(),
            status: "sent",
            subject: dispatch.title,
          });
          sent += 1;
        } catch (error) {
          await createNotificationMessageLog(this.#db, {
            body,
            channel: "in_app",
            companyId,
            customerId: stringField(payload, "customerId"),
            errorDetails: { error: errorMessage(error) },
            leadId: stringField(payload, "leadId"),
            provider: null,
            recipient: recipientLabel(recipient),
            status: "failed",
            subject: dispatch.title,
          });
          failed += 1;
        }
      }
    }

    return {
      failed,
      sent,
      skipped,
    };
  }

  async #sendEmailDispatches(
    companyId: string,
    dispatches: NotificationChannelDispatch[],
    shouldSendEmail: boolean,
  ): Promise<DeliverySummary> {
    const emailDispatches = dispatches.filter(
      (dispatch) => dispatch.channel === "email",
    );
    let sent = 0;
    let failed = 0;
    let skipped = dispatches.length - emailDispatches.length;

    for (const dispatch of emailDispatches) {
      const email = await this.#emailService.createDispatchEmail(dispatch);
      const result = shouldSendEmail
        ? await this.#emailService.send({
            html: email.body,
            subject: email.subject,
            to: email.to,
          })
        : undefined;
      const finalStatus = result?.status ?? "sent";
      const payload = recordFromPayload(dispatch.payload);
      const recipient =
        result?.recipients.join(", ") ||
        result?.originalRecipients.join(", ") ||
        email.to.join(", ");

      await createNotificationMessageLog(this.#db, {
        body: email.body,
        channel: "email",
        companyId,
        customerId: stringField(payload, "customerId"),
        errorDetails: result?.error
          ? { error: errorMessage(result.error) }
          : result?.wasRecipientOverridden
            ? {
                originalRecipients: result.originalRecipients,
                testEmailOverride: true,
              }
            : undefined,
        leadId: stringField(payload, "leadId"),
        provider: shouldSendEmail ? "resend" : null,
        providerId: result?.providerId ?? null,
        recipient,
        sentAt: finalStatus === "sent" ? new Date() : null,
        status: finalStatus,
        subject: email.subject,
      });

      if (finalStatus === "sent") {
        sent += 1;
      } else if (finalStatus === "failed") {
        failed += 1;
      } else {
        skipped += 1;
      }
    }

    return {
      failed,
      sent,
      skipped,
    };
  }

  async #sendWhatsAppDispatches(
    companyId: string,
    dispatches: NotificationChannelDispatch[],
  ): Promise<DeliverySummary> {
    const { results, summary } =
      await this.#whatsappService.sendDispatches(dispatches);

    for (const result of results) {
      const payload = recordFromPayload(result.payload);

      await createNotificationMessageLog(this.#db, {
        body: result.body,
        channel: "whatsapp",
        companyId,
        customerId: stringField(payload, "customerId"),
        errorDetails: result.error
          ? { error: errorMessage(result.error) }
          : undefined,
        leadId: stringField(payload, "leadId"),
        provider: result.status === "skipped" ? null : "whatsapp",
        providerId: result.providerId ?? null,
        recipient: result.recipient,
        sentAt: new Date(),
        status: result.status,
      });
    }

    return summary;
  }

  async #sendSmsDispatches(
    companyId: string,
    dispatches: NotificationChannelDispatch[],
  ): Promise<DeliverySummary> {
    const smsDispatches = dispatches.filter(
      (dispatch) => dispatch.channel === "sms",
    );
    let sent = 0;
    let failed = 0;
    let skipped = dispatches.length - smsDispatches.length;

    for (const dispatch of smsDispatches) {
      const payload = recordFromPayload(dispatch.payload);
      const body = textMessageFromDispatch(dispatch);

      for (const recipient of dispatch.recipients) {
        await createNotificationMessageLog(this.#db, {
          body,
          channel: "sms",
          companyId,
          customerId: stringField(payload, "customerId"),
          leadId: stringField(payload, "leadId"),
          provider: null,
          recipient: phoneRecipient(recipient),
          sentAt: new Date(),
          status: "sent",
          subject: dispatch.title,
        });
        sent += 1;
      }
    }

    return {
      failed,
      sent,
      skipped,
    };
  }

  async #sendPhoneDispatches(
    companyId: string,
    dispatches: NotificationChannelDispatch[],
  ): Promise<DeliverySummary> {
    const phoneDispatches = dispatches.filter(
      (dispatch) => dispatch.channel === "phone",
    );
    let sent = 0;
    let failed = 0;
    let skipped = dispatches.length - phoneDispatches.length;

    for (const dispatch of phoneDispatches) {
      const payload = recordFromPayload(dispatch.payload);
      const body = textMessageFromDispatch(dispatch);

      for (const recipient of dispatch.recipients) {
        await createNotificationMessageLog(this.#db, {
          body,
          channel: "phone",
          companyId,
          customerId: stringField(payload, "customerId"),
          leadId: stringField(payload, "leadId"),
          provider: null,
          recipient: phoneRecipient(recipient),
          sentAt: new Date(),
          status: "sent",
          subject: dispatch.title,
        });
        sent += 1;
      }
    }

    return {
      failed,
      sent,
      skipped,
    };
  }

  async send<TType extends PlotKeysNotificationType>(
    type: TType,
    companyId: string,
    payload: NotificationTypes[TType],
    options?: NotificationOptions,
  ): Promise<NotificationResult> {
    await this.#db.company.findUniqueOrThrow({
      select: { id: true },
      where: { id: companyId },
    });

    const recipients = options?.recipients?.length
      ? options.recipients
      : await this.#resolveDefaultRecipients(companyId);
    const notification = createNotificationDispatchFromType(
      plotKeysNotificationTypes,
      type,
      payload,
      {
        channels: options?.channels,
        recipients,
      },
    );
    const skippedProviderChannels: NotificationSkippedChannel[] = [];
    const supportedChannels = notification.channels.filter((channel) => {
      if (supportsProviderChannel(notification.notificationType, channel)) {
        return true;
      }

      skippedProviderChannels.push({
        channel,
        reason: providerChannelSkipReason(
          notification.notificationType,
          channel,
        ),
      });

      return false;
    });
    const plan = planNotificationDeliveries({
      ...notification,
      channels: supportedChannels,
    });
    const [email, phone, sms, whatsapp, inApp] = await Promise.all([
      this.#sendEmailDispatches(
        companyId,
        plan.dispatches,
        options?.sendEmail ?? false,
      ),
      this.#sendPhoneDispatches(companyId, plan.dispatches),
      this.#sendSmsDispatches(companyId, plan.dispatches),
      this.#sendWhatsAppDispatches(companyId, plan.dispatches),
      this.#persistInAppNotifications(companyId, plan.dispatches),
    ]);

    return {
      activities: inApp.sent,
      dispatches: {
        email,
        inApp,
        phone,
        sms,
        whatsapp,
      },
      skippedChannels: [...skippedProviderChannels, ...plan.skippedChannels],
      type,
    };
  }
}
