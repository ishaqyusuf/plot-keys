import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const authEmailVerifiedPayloadSchema = z.object({
  companyName: z.string().min(1),
  dashboardHostname: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  siteHostname: z.string().min(1),
});

export const authEmailVerified = defineNotificationType({
  defaultChannels: ["email", "in_app", "whatsapp"],
  defaultRecipients: ["user"],
  description:
    "The account email was verified and the workspace can continue into onboarding.",
  schema: authEmailVerifiedPayloadSchema,
  title: "Email verified successfully",
  variant: "success",
});

export type AuthEmailVerifiedPayload = z.infer<
  typeof authEmailVerifiedPayloadSchema
>;
