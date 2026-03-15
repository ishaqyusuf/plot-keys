import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const signupSuccessfulPayloadSchema = z.object({
  companyName: z.string().min(1),
  dashboardHostname: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  siteHostname: z.string().min(1),
  subdomain: z.string().min(1),
});

export const signupSuccessful = defineNotificationType({
  defaultChannels: ["in_app"],
  defaultRecipients: ["user", "subscriber"],
  description: "The owner account was created and tenant setup can continue.",
  schema: signupSuccessfulPayloadSchema,
  title: "Account created successfully",
  variant: "success",
});

export type SignupSuccessfulPayload = z.infer<
  typeof signupSuccessfulPayloadSchema
>;
