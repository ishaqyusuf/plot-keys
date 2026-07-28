import { describe, expect, test } from "bun:test";

import { notificationTaskPayloadSchema } from "./schemas";
import { plotKeysNotificationTypes } from "./notification-types";
import { supportsEmailNotificationType } from "./services/email-service";
import { supportsWhatsAppNotificationType } from "./services/whatsapp-service";

const expectedNotificationTypes = [
  "auth_email_verified",
  "auth_verification_requested",
  "builder_route_hint",
  "new_lead_captured",
  "onboarding_reminder",
  "signup_successful",
  "site_configuration_saved",
  "site_publish_requires_review",
  "site_published",
  "subscriber_lead_created",
  "workspace_invitation_sent",
] as const;

describe("notification type registry", () => {
  test("declares the durable business event types", () => {
    expect(Object.keys(plotKeysNotificationTypes).sort()).toEqual(
      [...expectedNotificationTypes].sort(),
    );
  });

  test("keeps provider support explicit by notification type", () => {
    expect(supportsEmailNotificationType("site_published")).toBe(true);
    expect(supportsEmailNotificationType("workspace_invitation_sent")).toBe(
      true,
    );
    expect(supportsEmailNotificationType("builder_route_hint")).toBe(false);

    expect(supportsWhatsAppNotificationType("new_lead_captured")).toBe(true);
    expect(supportsWhatsAppNotificationType("site_published")).toBe(false);
  });

  test("accepts task payloads for company-scoped business events", () => {
    const base = {
      author: { id: "user_1" },
      companyId: "company_1",
      recipients: [
        {
          email: "owner@example.com",
          kind: "user" as const,
          phoneNumber: "+2348012345678",
          userId: "user_1",
        },
      ],
    };

    expect(
      notificationTaskPayloadSchema.parse({
        ...base,
        channels: ["email", "in_app"],
        payload: {
          companyName: "Plot Keys",
          configName: "Main site",
          fullName: "Workspace Owner",
          siteUrl: "https://plotkeys.example",
        },
        sendEmail: true,
        type: "site_published",
      }),
    ).toMatchObject({ type: "site_published" });

    expect(
      notificationTaskPayloadSchema.parse({
        ...base,
        channels: ["in_app"],
        payload: { description: "Saved builder content field hero.title." },
        type: "site_configuration_saved",
      }),
    ).toMatchObject({ type: "site_configuration_saved" });

    expect(
      notificationTaskPayloadSchema.parse({
        ...base,
        channels: ["email", "in_app", "whatsapp"],
        payload: {
          companyName: "Plot Keys",
          dashboardUrl: "https://dashboard.plotkeys.example/leads",
          fullName: "Workspace Owner",
          leadEmail: "lead@example.com",
          leadId: "lead_1",
          leadMessage: "I want a viewing.",
          leadName: "Lead Person",
        },
        sendEmail: true,
        type: "new_lead_captured",
      }),
    ).toMatchObject({ type: "new_lead_captured" });

    expect(
      notificationTaskPayloadSchema.parse({
        ...base,
        channels: ["email"],
        payload: {
          companyName: "Plot Keys",
          inviteUrl: "https://dashboard.plotkeys.example/invite/token",
          inviterName: "Workspace Owner",
          recipientEmail: "agent@example.com",
          roleLabel: "Agent",
        },
        recipients: [
          {
            email: "agent@example.com",
            kind: "subscriber" as const,
            subscriberId: "workspace-invite:agent@example.com",
          },
        ],
        sendEmail: true,
        type: "workspace_invitation_sent",
      }),
    ).toMatchObject({ type: "workspace_invitation_sent" });
  });
});
