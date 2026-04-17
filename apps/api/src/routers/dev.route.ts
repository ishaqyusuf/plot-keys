/**
 * Dev-only tRPC router — helpers for local development and testing.
 *
 * Every procedure throws in production to prevent accidental exposure.
 */

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "../lib.trpc";

function assertDev() {
  if (process.env.NODE_ENV === "production") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Dev routes are disabled in production.",
    });
  }
}

export const devRouter = createTRPCRouter({
  /**
   * Returns all active companies so the DevTenantFab can list them.
   * Only works in development mode.
   */
  listTenants: publicProcedure.query(async ({ ctx }) => {
    assertDev();
    const db = ctx.db.db;
    if (!db) return [];

    const companies = await db.company.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        planTier: true,
        slug: true,
      },
      where: { deletedAt: null, isActive: true },
    });

    return companies.map((c) => ({
      id: c.id,
      name: c.name,
      planTier: c.planTier,
      subdomain: c.slug,
    }));
  }),
});
