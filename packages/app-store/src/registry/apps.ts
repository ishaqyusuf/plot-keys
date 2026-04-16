import type { AppDefinition } from "./types";

/**
 * Single source of truth for internal "apps" the dashboard exposes.
 *
 * Each entry becomes:
 *  - a toggle on `/app-store`
 *  - an icon in the app switcher rail
 *  - a set of nav groups shown in the sidebar while this app is active
 *
 * Routes here must match the actual Next.js route structure under
 * `apps/dashboard/src/app/(app)/...`.
 */
export const APP_REGISTRY: readonly AppDefinition[] = [
  {
    id: "listings",
    label: "Listings",
    icon: "Building2",
    description:
      "Manage properties, agents, leads, and viewing appointments for your real estate inventory.",
    category: "Sales",
    planGate: "starter",
    homeRoute: "/properties",
    navGroups: [
      {
        label: "Listings",
        items: [
          { href: "/properties", icon: "Building2", label: "Properties" },
          { href: "/agents", icon: "UsersRound", label: "Agents" },
          { href: "/leads", icon: "Mail", label: "Leads" },
          { href: "/appointments", icon: "Calendar", label: "Appointments" },
        ],
      },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    icon: "FileText",
    description:
      "Author and publish long-form content to your public website with a lightweight CMS.",
    category: "Marketing",
    planGate: "starter",
    homeRoute: "/blog",
    navGroups: [
      {
        label: "Content",
        items: [{ href: "/blog", icon: "FileText", label: "Blog" }],
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "BarChart3",
    description:
      "Track visitor behaviour, conversion events, and generate performance reports.",
    category: "Insights",
    planGate: "starter",
    homeRoute: "/analytics",
    navGroups: [
      {
        label: "Insights",
        items: [
          { href: "/analytics", icon: "BarChart3", label: "Analytics" },
          { href: "/reports", icon: "FileText", label: "Reports" },
        ],
      },
    ],
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: "Sparkles",
    description:
      "AI-powered content generation, smart fill, and chatbot assistance for your website.",
    category: "AI",
    planGate: "starter",
    homeRoute: "/ai-credits",
    navGroups: [
      {
        label: "AI",
        items: [{ href: "/ai-credits", icon: "Sparkles", label: "AI Credits" }],
      },
    ],
  },
  {
    id: "crm",
    label: "CRM",
    icon: "Users",
    description:
      "Manage customers, track saved listings, and handle offers from your customer portal.",
    category: "Sales",
    planGate: "plus",
    homeRoute: "/customers",
    navGroups: [
      {
        label: "Customers",
        items: [{ href: "/customers", icon: "Users", label: "Customers" }],
      },
    ],
  },
  {
    id: "hrm",
    label: "HR & Team",
    icon: "Briefcase",
    description:
      "Run payroll, track leave, and manage your employees, departments, and team structure.",
    category: "Operations",
    planGate: "plus",
    homeRoute: "/hr/employees",
    navGroups: [
      {
        label: "People",
        items: [
          { href: "/hr/employees", icon: "Briefcase", label: "Employees" },
          { href: "/hr/departments", icon: "Network", label: "Departments" },
          { href: "/hr/leave", icon: "CalendarOff", label: "Leave" },
          { href: "/hr/payroll", icon: "Receipt", label: "Payroll" },
          { href: "/team", icon: "UserRoundCog", label: "Team" },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: "HardHat",
    description:
      "Plan construction projects, track workforce, and manage budgets and delivery milestones.",
    category: "Operations",
    planGate: "plus",
    homeRoute: "/projects",
    navGroups: [
      {
        label: "Construction",
        items: [{ href: "/projects", icon: "HardHat", label: "Projects" }],
      },
    ],
  },
] as const;

export function findAppById(id: string): AppDefinition | null {
  return APP_REGISTRY.find((app) => app.id === id) ?? null;
}
