import { z } from "zod";
import { plotKeysNotificationTypes } from "./notification-types";
import type {
  NotificationPayload,
  PlotKeysNotificationType,
} from "./payload-utils";

export type NotificationTypes = {
  [Type in PlotKeysNotificationType]: NotificationPayload<Type>;
};

export const notificationChannelSchema = z.enum([
  "email",
  "in_app",
  "phone",
  "sms",
  "whatsapp",
]);

export const notificationContactSchema = z.discriminatedUnion("kind", [
  z.object({
    displayName: z.string().optional(),
    email: z.string().optional(),
    kind: z.literal("subscriber"),
    phoneNumber: z.string().optional(),
    subscriberId: z.string(),
    topic: z.string().optional(),
  }),
  z.object({
    displayName: z.string().optional(),
    email: z.string().optional(),
    kind: z.literal("user"),
    phoneNumber: z.string().optional(),
    userId: z.string(),
  }),
]);

const baseNotificationTaskPayloadSchema = z.object({
  author: z
    .object({
      id: z.string(),
    })
    .optional(),
  channels: z.array(notificationChannelSchema).optional(),
  companyId: z.string(),
  payload: z.record(z.unknown()),
  recipients: z.array(notificationContactSchema).optional(),
  sendEmail: z.boolean().optional(),
});

export const notificationTaskPayloadSchema = z.discriminatedUnion("type", [
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.auth_email_verified.schema,
    type: z.literal("auth_email_verified"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.auth_verification_requested.schema,
    type: z.literal("auth_verification_requested"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.builder_route_hint.schema,
    type: z.literal("builder_route_hint"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.new_lead_captured.schema,
    type: z.literal("new_lead_captured"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.onboarding_reminder.schema,
    type: z.literal("onboarding_reminder"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.signup_successful.schema,
    type: z.literal("signup_successful"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.site_configuration_saved.schema,
    type: z.literal("site_configuration_saved"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.site_publish_requires_review.schema,
    type: z.literal("site_publish_requires_review"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.site_published.schema,
    type: z.literal("site_published"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.subscriber_lead_created.schema,
    type: z.literal("subscriber_lead_created"),
  }),
  baseNotificationTaskPayloadSchema.extend({
    payload: plotKeysNotificationTypes.workspace_invitation_sent.schema,
    type: z.literal("workspace_invitation_sent"),
  }),
]);

export type NotificationJobInput = z.infer<
  typeof notificationTaskPayloadSchema
>;
