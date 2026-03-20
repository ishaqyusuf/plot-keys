import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const sitePublishedPayloadSchema = z.object({
  companyName: z.string().min(1),
  configName: z.string().min(1),
  fullName: z.string().min(1),
  siteUrl: z.string().min(1),
});

export type SitePublishedPayload = z.infer<typeof sitePublishedPayloadSchema>;

export const sitePublished = defineNotificationType({
  defaultChannels: ["email", "in_app"],
  defaultRecipients: ["user"],
  description: "The tenant website has been published with new content.",
  schema: sitePublishedPayloadSchema,
  title: "Site published",
  variant: "success",
});
