import { z } from "zod";

export const employeeStatusSchema = z.enum([
  "active",
  "on_leave",
  "suspended",
  "terminated",
]);

export const listEmployeesInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    departmentId: z.string().trim().min(1).optional(),
    end: z.string().optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
    start: z.string().optional().nullable(),
    status: employeeStatusSchema.optional(),
  })
  .optional();

export const employeeIdInputSchema = z.object({
  employeeId: z.string().trim().min(1, "Employee id is required."),
});

export const employeeIdsInputSchema = z.object({
  employeeIds: z.array(z.string().trim().min(1)).min(1),
});

export const updateEmployeeStatusInputSchema = employeeIdInputSchema.extend({
  status: employeeStatusSchema,
});
