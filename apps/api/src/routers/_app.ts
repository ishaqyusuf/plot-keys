import { createTRPCRouter } from "../lib.trpc";
import { authRouter } from "./auth.route";
import { healthRouter } from "./health.route";
import { workspaceRouter } from "./workspace.route";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  health: healthRouter,
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;
