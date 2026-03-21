import { createTRPCRouter } from "../lib.trpc";
import { authRouter } from "./auth.route";
import { customersRouter } from "./customers.route";
import { formsRouter } from "./forms.route";
import { healthRouter } from "./health.route";
import { notificationsRouter } from "./notifications.route";
import { projectsRouter } from "./projects.route";
import { propertyMediaRouter } from "./property-media.route";
import { teamRouter } from "./team.route";
import { workspaceRouter } from "./workspace.route";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  customers: customersRouter,
  forms: formsRouter,
  health: healthRouter,
  notifications: notificationsRouter,
  projects: projectsRouter,
  propertyMedia: propertyMediaRouter,
  team: teamRouter,
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;
