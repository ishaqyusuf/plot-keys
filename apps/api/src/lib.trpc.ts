import { hasActiveMembership } from "@plotkeys/auth";
import type { MembershipRole } from "@plotkeys/db";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to continue.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        session: ctx.auth.session,
      },
    },
  });
});

export const membershipProcedure = t.procedure.use(({ ctx, next }) => {
  if (!hasActiveMembership(ctx.auth)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "An active membership is required for this action.",
    });
  }
  const activeMembership = ctx.auth.activeMembership;
  const session = ctx.auth.session;

  const db = ctx.db.db;
  if (!db) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Database is unavailable.",
    });
  }

  return db.company
    .findUnique({
      where: { id: activeMembership.companyId },
      select: { qaPurgeStartedAt: true },
    })
    .then((company) => {
      if (company?.qaPurgeStartedAt) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This QA company is being permanently purged.",
        });
      }

      return next({
        ctx: {
          ...ctx,
          auth: {
            ...ctx.auth,
            activeMembership,
            session,
          },
        },
      });
    });
});

export const platformAdminProcedure = membershipProcedure.use(
  ({ ctx, next }) => {
    if (ctx.auth.activeMembership.role !== "platform_admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Platform administrator access is required.",
      });
    }
    return next({ ctx });
  },
);

// Role hierarchy — higher rank means more privileged
const roleRank: Record<MembershipRole, number> = {
  platform_admin: 99,
  owner: 4,
  admin: 3,
  agent: 2,
  staff: 1,
};

/**
 * Returns true when `actual` meets or exceeds `required` in the role hierarchy.
 */
export function isRoleAtLeast(actual: MembershipRole, required: MembershipRole): boolean {
  return roleRank[actual] >= roleRank[required];
}

/**
 * Throws FORBIDDEN if the caller's role is below the required minimum.
 * Must be called inside a membershipProcedure context.
 */
export function assertMinRole(actual: MembershipRole, required: MembershipRole): void {
  if (!isRoleAtLeast(actual, required)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `This action requires ${required} role or above.`,
    });
  }
}

/**
 * Procedure factory for role-gated endpoints.
 * Usage: minRoleProcedure("admin")
 */
export function minRoleProcedure(required: MembershipRole) {
  return membershipProcedure.use(({ ctx, next }) => {
    assertMinRole(ctx.auth.activeMembership.role, required);
    return next({ ctx });
  });
}
