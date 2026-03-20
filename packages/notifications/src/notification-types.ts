import { z } from "zod";
import type { NotificationContactKind } from "./contacts";
import type {
  NotificationChannel,
  NotificationDispatch,
  NotificationInput,
  NotificationVariant,
} from "./core-types";
import {
  authEmailVerified,
  type AuthEmailVerifiedPayload,
  authVerificationRequested,
  type AuthVerificationRequestedPayload,
  builderRouteHint,
  newLeadCaptured,
  type NewLeadCapturedPayload,
  onboardingReminder,
  type OnboardingReminderPayload,
  signupSuccessful,
  type SignupSuccessfulPayload,
  siteConfigurationSaved,
  sitePublished,
  type SitePublishedPayload,
  sitePublishRequiresReview,
  subscriberLeadCreated,
} from "./types";

type BuiltNotificationInput = Omit<NotificationInput, "action">;

export type NotificationTypeDefinition<
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = {
  defaultChannels?: NotificationChannel[];
  defaultRecipients?: NotificationContactKind[];
  description?: string;
  schema: TSchema;
  title?: string;
  variant?: NotificationVariant;
};

export type NotificationTypeRegistry = Record<
  string,
  NotificationTypeDefinition
>;

export function defineNotificationType<TSchema extends z.ZodTypeAny>(
  definition: NotificationTypeDefinition<TSchema>,
) {
  return definition;
}

export function defineNotificationTypes<
  TRegistry extends NotificationTypeRegistry,
>(registry: TRegistry) {
  return registry;
}

export function createNotificationFromType<
  TRegistry extends NotificationTypeRegistry,
  TType extends keyof TRegistry & string,
>(
  registry: TRegistry,
  notificationType: TType,
  payload: z.infer<TRegistry[TType]["schema"]>,
  input?: Omit<
    NotificationInput,
    "description" | "notificationType" | "title" | "variant"
  > & {
    description?: string;
    title?: string;
    variant?: NotificationVariant;
  },
): BuiltNotificationInput {
  const definition = registry[notificationType];

  if (!definition) {
    throw new Error(`Unknown notification type: ${notificationType}`);
  }

  definition.schema.parse(payload);

  return {
    ...input,
    channels: input?.channels ?? definition.defaultChannels ?? ["in_app"],
    description: input?.description ?? definition.description,
    notificationType,
    title: input?.title ?? definition.title ?? "Notification",
    variant: input?.variant ?? definition.variant ?? "info",
  };
}

export function createNotificationDispatchFromType<
  TRegistry extends NotificationTypeRegistry,
  TType extends keyof TRegistry & string,
>(
  registry: TRegistry,
  notificationType: TType,
  payload: z.infer<TRegistry[TType]["schema"]>,
  input?: Omit<
    NotificationDispatch,
    | "channels"
    | "description"
    | "notificationType"
    | "payload"
    | "recipients"
    | "title"
    | "variant"
  > & {
    channels?: NotificationChannel[];
    description?: string;
    recipients?: NotificationDispatch["recipients"];
    title?: string;
    variant?: NotificationVariant;
  },
): NotificationDispatch {
  const definition = registry[notificationType];

  if (!definition) {
    throw new Error(`Unknown notification type: ${notificationType}`);
  }

  definition.schema.parse(payload);

  return {
    ...input,
    channels: input?.channels ?? definition.defaultChannels ?? ["in_app"],
    description: input?.description ?? definition.description,
    notificationType,
    payload,
    recipients: input?.recipients ?? [],
    title: input?.title ?? definition.title ?? "Notification",
    variant: input?.variant ?? definition.variant ?? "info",
  };
}

export const plotKeysNotificationTypes = defineNotificationTypes({
  auth_email_verified: authEmailVerified,
  auth_verification_requested: authVerificationRequested,
  builder_route_hint: builderRouteHint,
  new_lead_captured: newLeadCaptured,
  onboarding_reminder: onboardingReminder,
  signup_successful: signupSuccessful,
  site_configuration_saved: siteConfigurationSaved,
  site_publish_requires_review: sitePublishRequiresReview,
  site_published: sitePublished,
  subscriber_lead_created: subscriberLeadCreated,
});
