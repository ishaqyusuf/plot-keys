import { hasActiveMembership } from "@plotkeys/auth";
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

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        activeMembership: ctx.auth.activeMembership,
        session: ctx.auth.session,
      },
    },
  });
});
