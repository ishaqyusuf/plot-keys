import { WhatsAppService as WhatsAppProviderService } from "@plotkeys/whatsapp";
import { normalizePhoneNumber } from "@plotkeys/utils";
import type { NotificationChannelDispatch } from "../core-types";

export type WhatsAppDispatchSendResult = {
  body: string;
  recipient: string;
  payload: unknown;
  error?: unknown;
  providerId?: string;
  status: string;
};

const whatsappNotificationTypes = new Set([
  "auth_email_verified",
  "auth_verification_requested",
  "new_lead_captured",
  "onboarding_reminder",
]);

export function supportsWhatsAppNotificationType(notificationType: string) {
  return whatsappNotificationTypes.has(notificationType);
}

function getWhatsAppProvider() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER?.trim();

  if (!accountSid || !authToken || !fromNumber) {
    return null;
  }

  return new WhatsAppProviderService(accountSid, authToken, fromNumber);
}

function buildWhatsAppMessage(dispatch: NotificationChannelDispatch) {
  switch (dispatch.notificationType) {
    case "auth_verification_requested": {
      const payload = dispatch.payload as {
        companyName: string;
        fullName: string;
        verificationUrl: string;
      };

      return [
        `Verify your PlotKeys account for ${payload.companyName}`,
        "",
        `Hi ${payload.fullName},`,
        "Confirm your email address to continue onboarding.",
        payload.verificationUrl,
      ].join("\n");
    }
    case "auth_email_verified": {
      const payload = dispatch.payload as {
        companyName: string;
        dashboardHostname: string;
        fullName: string;
      };

      return [
        `${payload.companyName} is verified`,
        "",
        `Hi ${payload.fullName},`,
        "Your email has been verified successfully.",
        `Continue onboarding: https://${payload.dashboardHostname}/onboarding`,
      ].join("\n");
    }
    case "onboarding_reminder": {
      const payload = dispatch.payload as {
        companyName: string;
        dashboardHostname: string;
        fullName: string;
      };

      return [
        `Finish setting up ${payload.companyName}`,
        "",
        `Hi ${payload.fullName},`,
        "Your workspace is almost ready. Continue onboarding here:",
        `https://${payload.dashboardHostname}/onboarding`,
      ].join("\n");
    }
    case "new_lead_captured": {
      const payload = dispatch.payload as {
        companyName: string;
        dashboardUrl: string;
        leadEmail: string;
        leadMessage?: string;
        leadName: string;
      };

      return [
        `New lead for ${payload.companyName}`,
        "",
        `${payload.leadName} submitted an inquiry.`,
        `Email: ${payload.leadEmail}`,
        payload.leadMessage ? `Message: ${payload.leadMessage}` : "",
        `Open dashboard: ${payload.dashboardUrl}`,
      ]
        .filter(Boolean)
        .join("\n");
    }
    default:
      throw new Error(
        `Unsupported WhatsApp notification type: ${dispatch.notificationType}`,
      );
  }
}

export class WhatsAppService {
  async sendDispatches(dispatches: NotificationChannelDispatch[]) {
    const whatsappDispatches = dispatches.filter(
      (dispatch) => dispatch.channel === "whatsapp",
    );

    if (!whatsappDispatches.length) {
      return {
        results: [] as WhatsAppDispatchSendResult[],
        summary: {
          failed: 0,
          sent: 0,
          skipped: dispatches.length,
        },
      };
    }

    const results: WhatsAppDispatchSendResult[] = [];
    const provider = getWhatsAppProvider();
    let sent = 0;
    let failed = 0;
    let skipped = dispatches.length - whatsappDispatches.length;

    for (const dispatch of whatsappDispatches) {
      const message = buildWhatsAppMessage(dispatch);

      for (const recipient of dispatch.recipients) {
        const recipientAddress =
          normalizePhoneNumber(recipient.phoneNumber ?? "") ||
          recipient.email ||
          "";

        if (!recipientAddress) {
          skipped += 1;
          continue;
        }

        try {
          if (!provider) {
            results.push({
              body: message,
              payload: dispatch.payload,
              recipient: recipientAddress,
              status: "sent",
            });
            sent += 1;
            continue;
          }

          const response = await provider.send({
            body: message,
            to: recipientAddress,
          });
          results.push({
            body: message,
            payload: dispatch.payload,
            providerId: response.providerId,
            recipient: recipientAddress,
            status: response.status ?? "sent",
          });
          sent += 1;
        } catch (error) {
          results.push({
            body: message,
            error,
            payload: dispatch.payload,
            recipient: recipientAddress,
            status: "failed",
          });
          failed += 1;
        }
      }
    }

    return {
      results,
      summary: {
        failed,
        sent,
        skipped,
      },
    };
  }

  async sendBulk(dispatches: NotificationChannelDispatch[]) {
    const result = await this.sendDispatches(dispatches);

    return result.summary;
  }
}
