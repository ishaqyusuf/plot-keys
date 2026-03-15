import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const sitePublishRequiresReviewPayloadSchema = z.object({
  description: z.string().min(1),
});

export const sitePublishRequiresReview = defineNotificationType({
  defaultChannels: ["in_app"],
  defaultRecipients: ["user"],
  description: "The current template still needs a final review before publish.",
  schema: sitePublishRequiresReviewPayloadSchema,
  title: "Publish needs review",
  variant: "warning",
});
