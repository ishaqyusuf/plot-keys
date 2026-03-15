import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const subscriberLeadCreatedPayloadSchema = z.object({
  description: z.string().min(1),
});

export const subscriberLeadCreated = defineNotificationType({
  defaultChannels: ["in_app"],
  defaultRecipients: ["subscriber", "user"],
  description: "A marketing lead subscribed from the tenant site.",
  schema: subscriberLeadCreatedPayloadSchema,
  title: "New subscriber captured",
  variant: "info",
});
