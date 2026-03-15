import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const siteConfigurationSavedPayloadSchema = z.object({
  description: z.string().min(1),
});

export const siteConfigurationSaved = defineNotificationType({
  defaultChannels: ["in_app"],
  defaultRecipients: ["user"],
  description: "The latest builder changes were stored for the workspace.",
  schema: siteConfigurationSavedPayloadSchema,
  title: "Draft saved",
  variant: "success",
});
