import { createTRPCRouter } from "../lib.trpc";
import { authRouter } from "./auth.route";
import { chatRouter } from "./chat.route";
import { customersRouter } from "./customers.route";
import { devRouter } from "./dev.route";
import { filtersRouter } from "./filters.route";
import { formsRouter } from "./forms.route";
import { healthRouter } from "./health.route";
import { notificationsRouter } from "./notifications.route";
import { projectsRouter } from "./projects.route";
import { propertyMediaRouter } from "./property-media.route";
import { publicImagesRouter } from "./public-images.route";
import { teamRouter } from "./team.route";
import { templateSandboxRouter } from "./template-sandbox.route";
import { workspaceRouter } from "./workspace.route";
import { qaMaintenanceRouter } from "./qa-maintenance.route";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  chat: chatRouter,
  customers: customersRouter,
  dev: devRouter,
  filters: filtersRouter,
  forms: formsRouter,
  health: healthRouter,
  notifications: notificationsRouter,
  projects: projectsRouter,
  propertyMedia: propertyMediaRouter,
  publicImages: publicImagesRouter,
  qaMaintenance: qaMaintenanceRouter,
  team: teamRouter,
  templateSandbox: templateSandboxRouter,
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;
