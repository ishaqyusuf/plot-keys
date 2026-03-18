import { createTRPCRouter } from "../lib.trpc";
import { authRouter } from "./auth.route";
import { formsRouter } from "./forms.route";
import { healthRouter } from "./health.route";
import { workspaceRouter } from "./workspace.route";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  forms: formsRouter,
  health: healthRouter,
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;
