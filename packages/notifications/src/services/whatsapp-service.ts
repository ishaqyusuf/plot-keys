import { createWhatsAppClient } from "@plotkeys/app-store/whatsapp-client";
import type { NotificationChannelDispatch } from "../core-types";
import { normalizePhoneNumber } from "@plotkeys/utils";

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
    default:
      throw new Error(
        `Unsupported WhatsApp notification type: ${dispatch.notificationType}`,
      );
  }
}

export class WhatsAppService {
  async sendBulk(dispatches: NotificationChannelDispatch[]) {
    const whatsappDispatches = dispatches.filter(
      (dispatch) => dispatch.channel === "whatsapp",
    );

    if (!whatsappDispatches.length) {
      return {
        failed: 0,
        sent: 0,
        skipped: dispatches.length,
      };
    }

    let client: ReturnType<typeof createWhatsAppClient>;

    try {
      client = createWhatsAppClient();
    } catch {
      return {
        failed: 0,
        sent: 0,
        skipped: dispatches.length,
      };
    }

    let sent = 0;
    let failed = 0;
    let skipped = dispatches.length - whatsappDispatches.length;

    for (const dispatch of whatsappDispatches) {
      const message = buildWhatsAppMessage(dispatch);

      for (const recipient of dispatch.recipients) {
        const phoneNumber = normalizePhoneNumber(recipient.phoneNumber ?? "");

        if (!phoneNumber) {
          skipped += 1;
          continue;
        }

        try {
          await client.sendMessage(phoneNumber, message);
          sent += 1;
        } catch {
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
}
