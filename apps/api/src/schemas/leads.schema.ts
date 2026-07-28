import { z } from "zod";

const leadStatusSchema = z.enum(["new", "contacted", "qualified", "closed"]);

export const listLeadsInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    end: z.string().optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
    start: z.string().optional().nullable(),
    status: leadStatusSchema.optional(),
  })
  .optional();

export const updateLeadStatusInputSchema = z.object({
  leadId: z.string().trim().min(1, "Lead id is required."),
  notes: z.string().trim().optional(),
  status: leadStatusSchema,
});

export const updateLeadsStatusInputSchema = z.object({
  leadIds: z.array(z.string().trim().min(1)).min(1),
  status: leadStatusSchema,
});

export const leadIdInputSchema = z.object({
  leadId: z.string().trim().min(1, "Lead id is required."),
});
