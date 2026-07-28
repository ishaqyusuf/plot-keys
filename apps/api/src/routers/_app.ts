import { createTRPCRouter } from "../lib.trpc";
import { agentsRouter } from "./agents.route";
import { aiCreditsRouter } from "./ai-credits.route";
import { analyticsRouter } from "./analytics.route";
import { appointmentsRouter } from "./appointments.route";
import { appsRouter } from "./apps.route";
import { authRouter } from "./auth.route";
import { billingRouter } from "./billing.route";
import { blogRouter } from "./blog.route";
import { chatRouter } from "./chat.route";
import { customersRouter } from "./customers.route";
import { departmentsRouter } from "./departments.route";
import { devRouter } from "./dev.route";
import { domainsRouter } from "./domains.route";
import { employeesRouter } from "./employees.route";
import { estatesRouter } from "./estates.route";
import { filtersRouter } from "./filters.route";
import { formsRouter } from "./forms.route";
import { healthRouter } from "./health.route";
import { integrationsRouter } from "./integrations.route";
import { leadsRouter } from "./leads.route";
import { leaveRequestsRouter } from "./leave-requests.route";
import { notificationsRouter } from "./notifications.route";
import { onboardingRouter } from "./onboarding.route";
import { overviewRouter } from "./overview.route";
import { payrollRouter } from "./payroll.route";
import { projectsRouter } from "./projects.route";
import { propertiesRouter } from "./properties.route";
import { propertyMediaRouter } from "./property-media.route";
import { publicImagesRouter } from "./public-images.route";
import { qaMaintenanceRouter } from "./qa-maintenance.route";
import { reportsRouter } from "./reports.route";
import { stockImagesRouter } from "./stock-images.route";
import { teamRouter } from "./team.route";
import { templatesRouter } from "./templates.route";
import { websiteRouter } from "./website.route";

export const appRouter = createTRPCRouter({
  aiCredits: aiCreditsRouter,
  agents: agentsRouter,
  analytics: analyticsRouter,
  apps: appsRouter,
  appointments: appointmentsRouter,
  auth: authRouter,
  billing: billingRouter,
  blog: blogRouter,
  chat: chatRouter,
  customers: customersRouter,
  departments: departmentsRouter,
  dev: devRouter,
  domains: domainsRouter,
  employees: employeesRouter,
  estates: estatesRouter,
  filters: filtersRouter,
  forms: formsRouter,
  health: healthRouter,
  integrations: integrationsRouter,
  leads: leadsRouter,
  leaveRequests: leaveRequestsRouter,
  notifications: notificationsRouter,
  onboarding: onboardingRouter,
  overview: overviewRouter,
  payroll: payrollRouter,
  projects: projectsRouter,
  properties: propertiesRouter,
  propertyMedia: propertyMediaRouter,
  publicImages: publicImagesRouter,
  qaMaintenance: qaMaintenanceRouter,
  reports: reportsRouter,
  stockImages: stockImagesRouter,
  team: teamRouter,
  templates: templatesRouter,
  website: websiteRouter,
});

export type AppRouter = typeof appRouter;
