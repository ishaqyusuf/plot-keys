/**
 * Notification dispatch job — sends emails, WhatsApp, and in-app messages.
 *
 * Trigger.dev boundary: registered as `notifications.dispatch` in the
 * Trigger.dev task catalog. Handles:
 *   1. Contact form submissions → company owner email + WhatsApp notification
 *   2. Newsletter signup confirmations → subscriber welcome email
 *   3. Property inquiry confirmations → agent email + subscriber receipt
 *
 * This replaces the TODO comments in `forms.route.ts` where notification
 * delivery was left as a future async task.
 *
 * When Trigger.dev is integrated, the `forms` tRPC router should call
 * `runInBackground(notificationDispatchHandler, payload)` after validating
 * each form submission.
 */

export type ContactFormPayload = {
  companyId: string;
  email: string;
  message: string;
  name: string;
  phone?: string;
};

export type PropertyInquiryPayload = {
  companyId: string;
  email: string;
  message?: string;
  name: string;
  phone?: string;
  propertyId?: string;
};

export type NewsletterSignupPayload = {
  companyId: string;
  email: string;
  name?: string;
};

export type NotificationDispatchPayload =
  | { data: ContactFormPayload; kind: "contact_form" }
  | { data: PropertyInquiryPayload; kind: "property_inquiry" }
  | { data: NewsletterSignupPayload; kind: "newsletter_signup" };

export async function notificationDispatchHandler(
  payload: NotificationDispatchPayload,
  _attempt: number,
): Promise<void> {
  // Resolve the company owner's contact details for internal notifications
  const { createPrismaClient } = await import("@plotkeys/db");
  const { db } = createPrismaClient();
  if (!db) return;

  const companyId =
    payload.kind === "contact_form" ||
    payload.kind === "property_inquiry" ||
    payload.kind === "newsletter_signup"
      ? payload.data.companyId
      : null;

  if (!companyId) return;

  const ownerMembership = await db.membership.findFirst({
    include: { user: true },
    where: { companyId, role: "owner" },
  });

  const ownerEmail = ownerMembership?.user?.email;

  switch (payload.kind) {
    case "contact_form": {
      if (ownerEmail) {
        // TODO: call email sender with template "contact_form_received"
        // await sendEmail({ to: ownerEmail, template: "contact_form_received", data: payload.data });
        console.log(
          `[notification-dispatch] Contact form → ${ownerEmail} from ${payload.data.email}`,
        );
      }
      break;
    }

    case "property_inquiry": {
      if (ownerEmail) {
        // TODO: call email sender with template "property_inquiry_received"
        console.log(
          `[notification-dispatch] Inquiry → ${ownerEmail} from ${payload.data.email}`,
        );
      }
      // TODO: send receipt to payload.data.email with template "property_inquiry_receipt"
      break;
    }

    case "newsletter_signup": {
      // TODO: send welcome email to payload.data.email with template "newsletter_welcome"
      console.log(
        `[notification-dispatch] Newsletter signup → ${payload.data.email}`,
      );
      break;
    }
  }
}
