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
import { resolveEmailRecipients } from "@plotkeys/utils";
import type { NotificationChannelDispatch } from "../core-types";

type ResendEmailPayload = {
  from: string;
  html: string;
  reply_to?: string;
  subject: string;
  to: string[];
};

export type EmailInput = {
  body?: string;
  data?: Record<string, unknown>;
  from?: string;
  html?: string;
  replyTo?: string;
  subject: string;
  to: string | string[];
};

export type EmailSendResult = {
  error?: unknown;
  originalRecipients: string[];
  providerId?: string;
  recipients: string[];
  status: "sent" | "failed" | "skipped";
  wasRecipientOverridden: boolean;
};

export type EmailDispatchInput = {
  body: string;
  subject: string;
  to: string[];
};

export type EmailDispatchSendResult = {
  email: EmailDispatchInput;
  result: EmailSendResult;
};

const emailNotificationTypes = new Set([
  "auth_email_verified",
  "auth_verification_requested",
  "new_lead_captured",
  "onboarding_reminder",
  "site_published",
  "workspace_invitation_sent",
]);

export function supportsEmailNotificationType(notificationType: string) {
  return emailNotificationTypes.has(notificationType);
}

function readNonEmptyEnv(key: string) {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

function getEmailFrom() {
  return readNonEmptyEnv("EMAIL_FROM_ADDRESS");
}

function getEmailReplyTo() {
  return readNonEmptyEnv("EMAIL_REPLY_TO");
}

function getResendApiKey() {
  return readNonEmptyEnv("RESEND_API_KEY");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToHtml(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function htmlFromEmailInput(email: EmailInput) {
  if (email.html?.trim()) {
    return email.html;
  }

  if (email.body?.trim()) {
    return textToHtml(email.body);
  }

  if (email.data) {
    return `<pre>${escapeHtml(JSON.stringify(email.data, null, 2))}</pre>`;
  }

  return "";
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
  const responsePayload = (await response.json().catch(() => null)) as {
    error?: unknown;
    id?: string;
  } | null;

  if (!response.ok || responsePayload?.error) {
    throw new Error(
      `Resend request failed with ${response.status}: ${
        responsePayload?.error
          ? JSON.stringify(responsePayload.error)
          : response.statusText
      }`,
    );
  }

  return responsePayload;
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
  async createDispatchEmail(
    dispatch: NotificationChannelDispatch,
  ): Promise<EmailDispatchInput> {
    const recipients = getEmailRecipients(dispatch);
    const emailPayload = await buildEmailPayload(dispatch);

    return {
      body: emailPayload.html,
      subject: emailPayload.subject,
      to: recipients,
    };
  }

  async sendDispatch(
    dispatch: NotificationChannelDispatch,
  ): Promise<EmailDispatchSendResult> {
    const email = await this.createDispatchEmail(dispatch);
    const result = await this.send({
      html: email.body,
      subject: email.subject,
      to: email.to,
    });

    return {
      email,
      result,
    };
  }

  async send(email: EmailInput): Promise<EmailSendResult> {
    const recipients = resolveEmailRecipients(email.to);
    const from = email.from ?? getEmailFrom();

    if (!getResendApiKey() || !from || recipients.recipients.length === 0) {
      return {
        originalRecipients: recipients.originalRecipients,
        recipients: recipients.recipients,
        status: "skipped",
        wasRecipientOverridden: recipients.isOverridden,
      };
    }

    try {
      const result = await sendEmail({
        from,
        html: htmlFromEmailInput(email),
        reply_to: email.replyTo ?? getEmailReplyTo(),
        subject: email.subject,
        to: recipients.recipients,
      });

      return {
        originalRecipients: recipients.originalRecipients,
        providerId: result?.id,
        recipients: recipients.recipients,
        status: "sent",
        wasRecipientOverridden: recipients.isOverridden,
      };
    } catch (error) {
      return {
        error,
        originalRecipients: recipients.originalRecipients,
        recipients: recipients.recipients,
        status: "failed",
        wasRecipientOverridden: recipients.isOverridden,
      };
    }
  }

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
    let skipped = dispatches.length - emailDispatches.length;

    for (const dispatch of emailDispatches) {
      const { result } = await this.sendDispatch(dispatch);

      if (result.status === "sent") {
        sent += 1;
      } else if (result.status === "failed") {
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
}
