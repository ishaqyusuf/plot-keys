import {
  countEmployeesByStatus,
  listEmployeesForCompany,
  softDeleteEmployee,
  updateEmployee,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  employeeIdInputSchema,
  employeeIdsInputSchema,
  listEmployeesInputSchema,
  updateEmployeeStatusInputSchema,
} from "../schemas/employees.schema";

export const employeesRouter = createTRPCRouter({
  delete: membershipProcedure
    .input(employeeIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await softDeleteEmployee(
        ctx.db.db,
        input.employeeId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found.",
        });
      }

      return { employeeId: input.employeeId };
    }),

  deleteMany: membershipProcedure
    .input(employeeIdsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const employeeIds = Array.from(new Set(input.employeeIds));
      const results = await Promise.all(
        employeeIds.map((employeeId) =>
          softDeleteEmployee(
            ctx.db.db,
            employeeId,
            ctx.auth.activeMembership.companyId,
          ),
        ),
      );

      if (results.some((result) => result.count === 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more employees were not found.",
        });
      }

      return { ids: employeeIds };
    }),

  list: membershipProcedure
    .input(listEmployeesInputSchema)
    .query(async ({ ctx, input }) => {
      return listEmployeesForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input ?? {},
      );
    }),

  stats: membershipProcedure.query(async ({ ctx }) => {
    return countEmployeesByStatus(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  updateStatus: membershipProcedure
    .input(updateEmployeeStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const employee = await updateEmployee(
        ctx.db.db,
        input.employeeId,
        ctx.auth.activeMembership.companyId,
        { status: input.status },
      );

      if (!employee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found.",
        });
      }

      return employee;
    }),
});
