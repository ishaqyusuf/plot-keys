import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const builderRouteHintPayloadSchema = z.object({
  description: z.string().min(1),
});

export const builderRouteHint = defineNotificationType({
  defaultChannels: ["in_app"],
  defaultRecipients: ["user"],
  description: "A builder follow-up route is ready to open.",
  schema: builderRouteHintPayloadSchema,
  title: "Builder route ready",
  variant: "info",
});
