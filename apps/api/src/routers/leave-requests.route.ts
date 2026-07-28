import {
  countLeaveRequestsByStatus,
  createLeaveRequestForCompany,
  listLeaveRequestsForCompany,
  setLeaveRequestStatusForCompany,
  setLeaveRequestsStatusForCompany,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  createLeaveRequestInputSchema,
  listLeaveRequestsInputSchema,
  updateLeaveRequestStatusInputSchema,
  updateLeaveRequestsStatusInputSchema,
} from "../schemas/leave-requests.schema";

export const leaveRequestsRouter = createTRPCRouter({
  create: membershipProcedure
    .input(createLeaveRequestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const leaveRequest = await createLeaveRequestForCompany(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        employeeId: input.employeeId,
        endDate: new Date(input.endDate),
        leaveType: input.leaveType,
        reason: input.reason ?? null,
        startDate: new Date(input.startDate),
      });

      if (!leaveRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found.",
        });
      }

      return leaveRequest;
    }),

  list: membershipProcedure
    .input(listLeaveRequestsInputSchema)
    .query(async ({ ctx, input }) => {
      return listLeaveRequestsForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input ?? {},
      );
    }),

  stats: membershipProcedure.query(async ({ ctx }) => {
    return countLeaveRequestsByStatus(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  updateManyStatus: membershipProcedure
    .input(updateLeaveRequestsStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const leaveRequestIds = Array.from(new Set(input.leaveRequestIds));
      const companyId = ctx.auth.activeMembership.companyId;
      const result =
        input.status === "approved"
          ? await setLeaveRequestsStatusForCompany(ctx.db.db, {
              approvedById: ctx.auth.session.user.id,
              companyId,
              leaveRequestIds,
              status: input.status,
            })
          : await setLeaveRequestsStatusForCompany(ctx.db.db, {
              companyId,
              leaveRequestIds,
              status: input.status,
            });

      if (result.count !== leaveRequestIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more leave requests were not found.",
        });
      }

      return { leaveRequestIds, status: input.status };
    }),

  updateStatus: membershipProcedure
    .input(updateLeaveRequestStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const result =
        input.status === "approved"
          ? await setLeaveRequestStatusForCompany(ctx.db.db, {
              approvedById: ctx.auth.session.user.id,
              companyId,
              leaveRequestId: input.leaveRequestId,
              status: input.status,
            })
          : await setLeaveRequestStatusForCompany(ctx.db.db, {
              companyId,
              leaveRequestId: input.leaveRequestId,
              status: input.status,
            });

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Leave request not found.",
        });
      }

      return { leaveRequestId: input.leaveRequestId, status: input.status };
    }),
});
