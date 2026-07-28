import { z } from "zod";

export const listAgentsInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
  })
  .optional();

export const agentIdInputSchema = z.object({
  agentId: z.string().trim().min(1, "Agent id is required."),
});

export const agentIdsInputSchema = z.object({
  agentIds: z.array(z.string().trim().min(1)).min(1),
});

const agentFieldsSchema = z.object({
  bio: z.string().trim().optional().nullable(),
  displayOrder: z.number().int().optional().nullable(),
  email: z.string().email().optional().nullable(),
  featured: z.boolean().optional(),
  imageUrl: z.string().url().optional().nullable(),
  name: z.string().trim().min(1, "Name is required."),
  phone: z.string().trim().optional().nullable(),
  title: z.string().trim().optional().nullable(),
});

export const createAgentInputSchema = agentFieldsSchema.extend({
  featured: z.boolean().optional().default(false),
});

export const updateAgentInputSchema = agentFieldsSchema.partial().extend({
  agentId: z.string().trim().min(1, "Agent id is required."),
});
