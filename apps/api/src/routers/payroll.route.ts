import {
  createPayrollEntryForCompany,
  getAvailablePayrollPeriods,
  getPayrollSummaryForPeriod,
  listPayrollForPeriod,
  markPayrollPaid,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  createPayrollEntryInputSchema,
  listPayrollInputSchema,
  payrollEntryIdInputSchema,
  payrollEntryIdsInputSchema,
  payrollPeriodInputSchema,
} from "../schemas/payroll.schema";

export const payrollRouter = createTRPCRouter({
  create: membershipProcedure
    .input(createPayrollEntryInputSchema)
    .mutation(async ({ ctx, input }) => {
      const payrollEntry = await createPayrollEntryForCompany(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        ...input,
      });

      if (!payrollEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found.",
        });
      }

      return payrollEntry;
    }),

  list: membershipProcedure
    .input(listPayrollInputSchema)
    .query(async ({ ctx, input }) => {
      const { periodMonth, periodYear, ...options } = input;
      return listPayrollForPeriod(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        periodYear,
        periodMonth,
        options,
      );
    }),

  markManyPaid: membershipProcedure
    .input(payrollEntryIdsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const payrollEntryIds = Array.from(new Set(input.payrollEntryIds));
      const results = await Promise.all(
        payrollEntryIds.map((payrollEntryId) =>
          markPayrollPaid(
            ctx.db.db,
            payrollEntryId,
            ctx.auth.activeMembership.companyId,
          ),
        ),
      );

      if (results.some((result) => result.count === 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more payroll entries were not found.",
        });
      }

      return { ids: payrollEntryIds };
    }),

  markPaid: membershipProcedure
    .input(payrollEntryIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await markPayrollPaid(
        ctx.db.db,
        input.payrollEntryId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payroll entry not found.",
        });
      }

      return { payrollEntryId: input.payrollEntryId };
    }),

  periods: membershipProcedure.query(async ({ ctx }) => {
    return getAvailablePayrollPeriods(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  summary: membershipProcedure
    .input(payrollPeriodInputSchema)
    .query(async ({ ctx, input }) => {
      return getPayrollSummaryForPeriod(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input.periodYear,
        input.periodMonth,
      );
    }),
});
