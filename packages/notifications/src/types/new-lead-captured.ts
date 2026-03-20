import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const newLeadCapturedPayloadSchema = z.object({
  companyName: z.string().min(1),
  dashboardUrl: z.string().min(1),
  fullName: z.string().min(1),
  leadEmail: z.string().min(1),
  leadMessage: z.string().optional(),
  leadName: z.string().min(1),
});

export type NewLeadCapturedPayload = z.infer<
  typeof newLeadCapturedPayloadSchema
>;

export const newLeadCaptured = defineNotificationType({
  defaultChannels: ["email", "in_app"],
  defaultRecipients: ["user"],
  description: "A new lead has been captured from the tenant website.",
  schema: newLeadCapturedPayloadSchema,
  title: "New lead captured",
  variant: "info",
});
