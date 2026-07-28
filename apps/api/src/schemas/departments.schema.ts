import { z } from "zod";

export const listDepartmentsInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
  })
  .optional();

export const createDepartmentInputSchema = z.object({
  description: z.string().trim().optional().nullable(),
  name: z.string().trim().min(1, "Department name is required."),
});

export const departmentIdInputSchema = z.object({
  departmentId: z.string().trim().min(1, "Department id is required."),
});

export const departmentIdsInputSchema = z.object({
  departmentIds: z.array(z.string().trim().min(1)).min(1),
});
