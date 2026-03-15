import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const authVerificationRequestedPayloadSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  verificationUrl: z.string().url(),
});

export const authVerificationRequested = defineNotificationType({
  defaultChannels: ["email", "in_app", "whatsapp"],
  defaultRecipients: ["user"],
  description:
    "A newly signed-up user needs to verify their email before onboarding continues.",
  schema: authVerificationRequestedPayloadSchema,
  title: "Verify your PlotKeys account",
  variant: "info",
});

export type AuthVerificationRequestedPayload = z.infer<
  typeof authVerificationRequestedPayloadSchema
>;
