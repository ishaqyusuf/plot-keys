import { z } from "zod";

export const payrollPeriodInputSchema = z.object({
  periodMonth: z.number().int().min(1).max(12),
  periodYear: z.number().int().min(2020).max(2100),
});

export const listPayrollInputSchema = payrollPeriodInputSchema.extend({
  cursor: z.union([z.string(), z.number()]).optional().nullable(),
  q: z.string().optional().nullable(),
  size: z.union([z.string(), z.number()]).optional().nullable(),
  sort: z.array(z.string()).optional().nullable(),
});

export const createPayrollEntryInputSchema = payrollPeriodInputSchema.extend({
  employeeId: z.string().trim().min(1, "Employee id is required."),
  grossAmount: z.number().int().min(0),
  netAmount: z.number().int().min(0),
  notes: z.string().trim().optional().nullable(),
});

export const payrollEntryIdInputSchema = z.object({
  payrollEntryId: z.string().trim().min(1, "Payroll entry id is required."),
});

export const payrollEntryIdsInputSchema = z.object({
  payrollEntryIds: z.array(z.string().trim().min(1)).min(1),
});
