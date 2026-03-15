import { z } from "zod";
import type { NotificationContactKind } from "./contacts";
import type { NotificationInput, NotificationVariant } from "./types";

type BuiltNotificationInput = Omit<NotificationInput, "action">;

export type NotificationTypeDefinition<
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = {
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
    description: input?.description ?? definition.description,
    notificationType,
    title: input?.title ?? definition.title ?? "Notification",
    variant: input?.variant ?? definition.variant ?? "info",
  };
}

export const signupSuccessfulPayloadSchema = z.object({
  companyName: z.string().min(1),
  dashboardHostname: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  siteHostname: z.string().min(1),
  subdomain: z.string().min(1),
});

export const plotKeysNotificationTypes = defineNotificationTypes({
  signup_successful: defineNotificationType({
    defaultRecipients: ["user", "subscriber"],
    description: "The owner account was created and tenant setup can continue.",
    schema: signupSuccessfulPayloadSchema,
    title: "Account created successfully",
    variant: "success",
  }),
});

export type SignupSuccessfulPayload = z.infer<
  typeof signupSuccessfulPayloadSchema
>;
