import { z } from "zod";
import { defineNotificationType } from "../notification-types";

export const workspaceInvitationSentPayloadSchema = z.object({
  companyName: z.string().min(1),
  inviteUrl: z.string().url(),
  inviterName: z.string().min(1),
  recipientEmail: z.string().email(),
  roleLabel: z.string().min(1),
});

export const workspaceInvitationSent = defineNotificationType({
  defaultChannels: ["email"],
  defaultRecipients: ["subscriber"],
  description:
    "A user has been invited to join a PlotKeys workspace and complete their profile.",
  schema: workspaceInvitationSentPayloadSchema,
  title: "Workspace invitation",
  variant: "info",
});

export type WorkspaceInvitationSentPayload = z.infer<
  typeof workspaceInvitationSentPayloadSchema
>;
