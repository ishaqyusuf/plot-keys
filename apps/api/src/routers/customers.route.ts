import {
  countCustomersByStatus,
  createCustomer,
  listCustomersForCompany,
  softDeleteCustomer,
  updateCustomer,
} from "@plotkeys/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const customersRouter = createTRPCRouter({
  /** List all customers for the company. */
  list: membershipProcedure
    .input(
      z.object({
        status: z.enum(["active", "inactive", "vip"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return [];

      return listCustomersForCompany(db, ctx.auth.activeMembership.companyId, {
        status: input.status,
      });
    }),

  /** Status count breakdown. */
  stats: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db) return { active: 0, inactive: 0, vip: 0 };

    return countCustomersByStatus(db, ctx.auth.activeMembership.companyId);
  }),

  /** Create a customer directly or from a lead. */
  create: membershipProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Name is required."),
        email: z.string().email().optional().nullable(),
        phone: z.string().trim().optional().nullable(),
        notes: z.string().trim().optional().nullable(),
        status: z.enum(["active", "inactive", "vip"]).optional().default("active"),
        sourceLeadId: z.string().uuid().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      return createCustomer(db, {
        companyId: ctx.auth.activeMembership.companyId,
        ...input,
      });
    }),

  /** Update a customer's details or status. */
  update: membershipProcedure
    .input(
      z.object({
        customerId: z.string().uuid(),
        name: z.string().trim().min(1).optional(),
        email: z.string().email().optional().nullable(),
        phone: z.string().trim().optional().nullable(),
        notes: z.string().trim().optional().nullable(),
        status: z.enum(["active", "inactive", "vip"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      const { customerId, ...data } = input;
      return updateCustomer(db, customerId, ctx.auth.activeMembership.companyId, data);
    }),

  /** Soft-delete a customer. */
  delete: membershipProcedure
    .input(z.object({ customerId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      await softDeleteCustomer(db, input.customerId, ctx.auth.activeMembership.companyId);
      return { deleted: true };
    }),
});
