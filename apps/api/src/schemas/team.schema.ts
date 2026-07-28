import { z } from "zod";

export const updateTeamInputSchema = z.object({
  logoUrl: z
    .string()
    .trim()
    .url("A valid URL is required.")
    .nullable()
    .optional(),
  market: z.string().trim().max(120).optional().nullable(),
  name: z.string().trim().min(2).max(32).optional(),
});

export const teamInviteTokenInputSchema = z.object({
  token: z.string().trim().min(1, "Invite token is required."),
});

export const completeTeamInviteProfileInputSchema =
  teamInviteTokenInputSchema.extend({
    bio: z.string().trim().optional().nullable(),
    imageUrl: z.string().trim().optional().nullable(),
    name: z.string().trim().min(1, "Name is required."),
    phone: z.string().trim().optional().nullable(),
  });
