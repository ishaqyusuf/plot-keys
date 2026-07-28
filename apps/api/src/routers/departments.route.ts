import {
  createDepartment,
  listDepartmentsForCompany,
  softDeleteDepartment,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  createDepartmentInputSchema,
  departmentIdInputSchema,
  departmentIdsInputSchema,
  listDepartmentsInputSchema,
} from "../schemas/departments.schema";

export const departmentsRouter = createTRPCRouter({
  create: membershipProcedure
    .input(createDepartmentInputSchema)
    .mutation(async ({ ctx, input }) => {
      return createDepartment(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        ...input,
      });
    }),

  delete: membershipProcedure
    .input(departmentIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await softDeleteDepartment(
        ctx.db.db,
        input.departmentId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Department not found.",
        });
      }

      return { departmentId: input.departmentId };
    }),

  deleteMany: membershipProcedure
    .input(departmentIdsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const departmentIds = Array.from(new Set(input.departmentIds));
      const results = await Promise.all(
        departmentIds.map((departmentId) =>
          softDeleteDepartment(
            ctx.db.db,
            departmentId,
            ctx.auth.activeMembership.companyId,
          ),
        ),
      );

      if (results.some((result) => result.count === 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more departments were not found.",
        });
      }

      return { ids: departmentIds };
    }),

  list: membershipProcedure
    .input(listDepartmentsInputSchema)
    .query(async ({ ctx, input }) => {
      return listDepartmentsForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input ?? {},
      );
    }),
});
