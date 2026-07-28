import {
  convertLeadToCustomerForCompany,
  countLeadsByStatus,
  listLeadsForCompany,
  updateLeadStatusForCompany,
  updateLeadsStatusForCompany,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  leadIdInputSchema,
  listLeadsInputSchema,
  updateLeadStatusInputSchema,
  updateLeadsStatusInputSchema,
} from "../schemas/leads.schema";

export const leadsRouter = createTRPCRouter({
  convertToCustomer: membershipProcedure
    .input(leadIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await convertLeadToCustomerForCompany(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        leadId: input.leadId,
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found.",
        });
      }

      return result;
    }),

  list: membershipProcedure
    .input(listLeadsInputSchema)
    .query(async ({ ctx, input }) => {
      return listLeadsForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input,
      );
    }),

  stats: membershipProcedure.query(async ({ ctx }) => {
    return countLeadsByStatus(ctx.db.db, ctx.auth.activeMembership.companyId);
  }),

  updateManyStatus: membershipProcedure
    .input(updateLeadsStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await updateLeadsStatusForCompany(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        leadIds: input.leadIds,
        status: input.status,
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more leads were not found.",
        });
      }

      return result;
    }),

  updateStatus: membershipProcedure
    .input(updateLeadStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedLead = await updateLeadStatusForCompany(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        leadId: input.leadId,
        notes: input.notes,
        status: input.status,
      });

      if (!updatedLead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found.",
        });
      }

      return { leadId: updatedLead.id, status: updatedLead.status };
    }),
});
