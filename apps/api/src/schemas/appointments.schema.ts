import { z } from "zod";

const appointmentStatusSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const listAppointmentsInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    end: z.string().optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
    start: z.string().optional().nullable(),
    status: appointmentStatusSchema.optional(),
    upcoming: z.boolean().optional(),
  })
  .optional();

export const createAppointmentInputSchema = z.object({
  agentId: z.string().uuid().optional(),
  email: z.string().email(),
  leadId: z.string().uuid().optional(),
  location: z.string().trim().optional(),
  name: z.string().trim().min(1),
  notes: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  propertyId: z.string().uuid().optional(),
  scheduledAt: z.string().datetime(),
});

export const updateAppointmentStatusInputSchema = z.object({
  appointmentId: z.string().uuid(),
  notes: z.string().trim().optional(),
  status: appointmentStatusSchema,
});

export const appointmentIdInputSchema = z.object({
  appointmentId: z.string().uuid(),
});

export const appointmentIdsInputSchema = z.object({
  appointmentIds: z.array(z.string().uuid()).min(1),
});
