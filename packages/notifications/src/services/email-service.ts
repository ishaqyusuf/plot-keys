import {
  defaultNewLeadSubject,
  defaultSitePublishedSubject,
  defaultVerificationSubject,
  defaultWelcomeSubject,
  defaultWorkspaceInvitationSubject,
} from "@plotkeys/email";
import NewLeadEmail from "@plotkeys/email/emails/new-lead";
import SitePublishedEmail from "@plotkeys/email/emails/site-published";
import VerificationEmail from "@plotkeys/email/emails/verification";
import WelcomeEmail from "@plotkeys/email/emails/welcome";
import WorkspaceInvitationEmail from "@plotkeys/email/emails/workspace-invitation";
import { render } from "@plotkeys/email/render";
import type { NotificationChannelDispatch } from "../core-types";

type ResendEmailPayload = {
  from: string;
  html: string;
  reply_to?: string;
  subject: string;
  to: string[];
};

function getEmailFrom() {
  return process.env.EMAIL_FROM ?? "PlotKeys <notifications@plotkeys.com>";
}

function getEmailReplyTo() {
  return process.env.EMAIL_REPLY_TO;
}

function getResendApiKey() {
  return process.env.RESEND_API_KEY;
}

async function sendEmail(payload: ResendEmailPayload) {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Resend request failed with ${response.status}: ${errorText}`,
    );
  }
}

function getEmailRecipients(dispatch: NotificationChannelDispatch) {
  return dispatch.recipients
    .map((recipient) => recipient.email?.trim())
    .filter((email): email is string => Boolean(email));
}

async function buildEmailPayload(dispatch: NotificationChannelDispatch) {
  switch (dispatch.notificationType) {
    case "auth_verification_requested": {
      const payload = dispatch.payload as {
        companyName: string;
        fullName: string;
        verificationUrl: string;
      };

      return {
        html: await render(
          VerificationEmail({
            companyName: payload.companyName,
            fullName: payload.fullName,
            verificationUrl: payload.verificationUrl,
          }),
        ),
        subject: defaultVerificationSubject(payload.companyName),
      };
    }
    case "auth_email_verified": {
      const payload = dispatch.payload as {
        companyName: string;
        fullName: string;
        dashboardHostname: string;
        siteHostname: string;
      };

      const ctaUrl = `https://${payload.dashboardHostname}/onboarding`;

      return {
        html: await render(
          WelcomeEmail({
            companyName: payload.companyName,
            ctaUrl,
            fullName: payload.fullName,
            siteHostname: payload.siteHostname,
          }),
        ),
        subject: defaultWelcomeSubject(payload.companyName),
      };
    }
    case "onboarding_reminder": {
      const payload = dispatch.payload as {
        companyName: string;
        dashboardHostname: string;
        fullName: string;
        siteHostname: string;
      };

      return {
        html: `
          <div>
            <h1>Finish setting up ${payload.companyName}</h1>
            <p>Hi ${payload.fullName},</p>
            <p>Your PlotKeys workspace is almost ready. Continue onboarding to launch ${payload.siteHostname}.</p>
            <p><a href="https://${payload.dashboardHostname}/onboarding">Continue onboarding</a></p>
          </div>
        `,
        subject: `Finish setting up ${payload.companyName}`,
      };
    }
    case "new_lead_captured": {
      const payload = dispatch.payload as {
        companyName: string;
        dashboardUrl: string;
        fullName: string;
        leadEmail: string;
        leadMessage?: string;
        leadName: string;
      };

      return {
        html: await render(
          NewLeadEmail({
            companyName: payload.companyName,
            dashboardUrl: payload.dashboardUrl,
            fullName: payload.fullName,
            leadEmail: payload.leadEmail,
            leadMessage: payload.leadMessage,
            leadName: payload.leadName,
          }),
        ),
        subject: defaultNewLeadSubject(payload.companyName),
      };
    }
    case "site_published": {
      const payload = dispatch.payload as {
        companyName: string;
        configName: string;
        fullName: string;
        siteUrl: string;
      };

      return {
        html: await render(
          SitePublishedEmail({
            companyName: payload.companyName,
            configName: payload.configName,
            fullName: payload.fullName,
            siteUrl: payload.siteUrl,
          }),
        ),
        subject: defaultSitePublishedSubject(
          payload.companyName,
          payload.configName,
        ),
      };
    }
    case "workspace_invitation_sent": {
      const payload = dispatch.payload as {
        companyName: string;
        inviteUrl: string;
        inviterName: string;
        recipientEmail: string;
        roleLabel: string;
      };

      return {
        html: await render(
          WorkspaceInvitationEmail({
            companyName: payload.companyName,
            inviteUrl: payload.inviteUrl,
            inviterName: payload.inviterName,
            roleLabel: payload.roleLabel,
          }),
        ),
        subject: defaultWorkspaceInvitationSubject(payload.companyName),
      };
    }
    default:
      throw new Error(
        `Unsupported email notification type: ${dispatch.notificationType}`,
      );
  }
}

export class EmailService {
  async sendBulk(dispatches: NotificationChannelDispatch[]) {
    const emailDispatches = dispatches.filter(
      (dispatch) => dispatch.channel === "email",
    );

    if (!emailDispatches.length) {
      return {
        failed: 0,
        sent: 0,
        skipped: dispatches.length,
      };
    }

    let sent = 0;
    let failed = 0;

    for (const dispatch of emailDispatches) {
      const recipients = getEmailRecipients(dispatch);

      if (!recipients.length) {
        continue;
      }

      try {
        const emailPayload = await buildEmailPayload(dispatch);

        await sendEmail({
          from: getEmailFrom(),
          html: emailPayload.html,
          reply_to: getEmailReplyTo(),
          subject: emailPayload.subject,
          to: recipients,
        });

        sent += 1;
      } catch {
        failed += 1;
      }
    }

    return {
      failed,
      sent,
      skipped: dispatches.length - emailDispatches.length,
    };
  }
}
