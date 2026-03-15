import { authRouter } from "./auth.route";
import { createTRPCRouter } from "../lib.trpc";
import { healthRouter } from "./health.route";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
