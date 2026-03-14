import { createTRPCRouter } from "../lib.trpc";
import { healthRouter } from "./health.route";

export const appRouter = createTRPCRouter({
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
