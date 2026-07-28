import { z } from "zod";

const leaveRequestStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "cancelled",
]);

const leaveRequestActionStatusSchema = z.enum([
  "approved",
  "rejected",
  "cancelled",
]);

export const listLeaveRequestsInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    employeeId: z.string().trim().min(1).optional(),
    end: z.string().optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
    start: z.string().optional().nullable(),
    status: leaveRequestStatusSchema.optional(),
  })
  .optional();

export const createLeaveRequestInputSchema = z.object({
  employeeId: z.string().trim().min(1, "Employee id is required."),
  endDate: z.string().date("A valid end date is required."),
  leaveType: z.enum([
    "annual",
    "compassionate",
    "maternity",
    "paternity",
    "sick",
    "unpaid",
  ]),
  reason: z.string().trim().optional().nullable(),
  startDate: z.string().date("A valid start date is required."),
});

export const updateLeaveRequestStatusInputSchema = z.object({
  leaveRequestId: z.string().trim().min(1, "Leave request id is required."),
  status: leaveRequestActionStatusSchema,
});

export const updateLeaveRequestsStatusInputSchema = z.object({
  leaveRequestIds: z.array(z.string().trim().min(1)).min(1),
  status: leaveRequestActionStatusSchema,
});
