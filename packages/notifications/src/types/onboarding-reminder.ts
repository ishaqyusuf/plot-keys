import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const onboardingReminderPayloadSchema = z.object({
  companyName: z.string().min(1),
  dashboardHostname: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  siteHostname: z.string().min(1),
});

export const onboardingReminder = defineNotificationType({
  defaultChannels: ["email", "whatsapp", "in_app"],
  defaultRecipients: ["user"],
  description:
    "The workspace owner has not completed onboarding after signup.",
  schema: onboardingReminderPayloadSchema,
  title: "Finish setting up your workspace",
  variant: "warning",
});

export type OnboardingReminderPayload = z.infer<
  typeof onboardingReminderPayloadSchema
>;
