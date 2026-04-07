import { Icon } from "@plotkeys/ui/icons";

export type NavItem = {
  badge?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

export type NavGroup = {
  items: NavItem[];
  label: string;
};

export type AppDefinition = {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  navGroup: NavGroup;
  isCore: boolean;
  defaultInstalled: boolean;
  requiredPlan?: "plus" | "pro";
};

export const APP_REGISTRY: AppDefinition[] = [
  {
    key: "core-overview",
    name: "Overview",
    description: "Dashboard home, website builder, and live preview.",
    icon: Icon.Home,
    isCore: true,
    defaultInstalled: true,
    navGroup: {
      label: "Overview",
      items: [
        { href: "/", icon: Icon.Home, label: "Dashboard" },
        { href: "/builder", icon: Icon.Builder, label: "Builder" },
        { href: "/live", icon: Icon.Globe, label: "Live Preview" },
      ],
    },
  },
  {
    key: "listings",
    name: "Listings",
    description:
      "Manage property listings, agents, and your blog/CMS content.",
    icon: Icon.Building,
    isCore: false,
    defaultInstalled: true,
    navGroup: {
      label: "Listings",
      items: [
        { href: "/properties", icon: Icon.Building, label: "Properties" },
        { href: "/agents", icon: Icon.UsersGroup, label: "Agents" },
        { href: "/blog", icon: Icon.File, label: "Blog", badge: "Pro" },
      ],
    },
  },
  {
    key: "crm",
    name: "CRM",
    description:
      "Track leads, manage appointments, and maintain your customer pipeline.",
    icon: Icon.Users,
    isCore: false,
    defaultInstalled: true,
    navGroup: {
      label: "CRM",
      items: [
        { href: "/leads", icon: Icon.Mail, label: "Leads" },
        { href: "/appointments", icon: Icon.Calendar, label: "Appointments" },
        {
          href: "/customers",
          icon: Icon.Users,
          label: "Customers",
          badge: "Plus",
        },
      ],
    },
  },
  {
    key: "hr",
    name: "HR & Team",
    description:
      "Manage employees, departments, leave requests, payroll, and team access.",
    icon: Icon.Briefcase,
    isCore: false,
    defaultInstalled: true,
    navGroup: {
      label: "HR & Team",
      items: [
        { href: "/hr/employees", icon: Icon.Briefcase, label: "Employees" },
        {
          href: "/hr/departments",
          icon: Icon.Network,
          label: "Departments",
        },
        {
          href: "/hr/leave",
          icon: Icon.CalendarOff,
          label: "Leave",
          badge: "Plus",
        },
        {
          href: "/hr/payroll",
          icon: Icon.Receipt,
          label: "Payroll",
          badge: "Plus",
        },
        { href: "/team", icon: Icon.UserSettings, label: "Team" },
      ],
    },
  },
  {
    key: "construction",
    name: "Construction",
    description:
      "Track construction projects, phases, milestones, budgets, and site teams.",
    icon: Icon.HardHat,
    isCore: false,
    defaultInstalled: false,
    requiredPlan: "plus",
    navGroup: {
      label: "Construction",
      items: [
        {
          href: "/projects",
          icon: Icon.HardHat,
          label: "Projects",
          badge: "Plus",
        },
      ],
    },
  },
  {
    key: "analytics",
    name: "Analytics",
    description:
      "View traffic analytics, reports, AI usage credits, and chat-bot activity.",
    icon: Icon.Analytics,
    isCore: false,
    defaultInstalled: true,
    navGroup: {
      label: "Analytics",
      items: [
        { href: "/analytics", icon: Icon.Analytics, label: "Analytics" },
        {
          href: "/reports",
          icon: Icon.File,
          label: "Reports",
          badge: "Plus",
        },
        {
          href: "/ai-credits",
          icon: Icon.Sparkles,
          label: "AI Credits",
          badge: "AI",
        },
        { href: "#", icon: Icon.Bot, label: "Chat-bot", badge: "Pro" },
      ],
    },
  },
  {
    key: "core-platform",
    name: "Platform",
    description: "Billing, domains, notifications, settings, and app store.",
    icon: Icon.Settings,
    isCore: true,
    defaultInstalled: true,
    navGroup: {
      label: "Platform",
      items: [
        { href: "/billing", icon: Icon.CreditCard, label: "Billing" },
        { href: "/domains", icon: Icon.Globe, label: "Domains" },
        {
          href: "/notifications",
          icon: Icon.Bell,
          label: "Notifications",
        },
        { href: "/settings", icon: Icon.Settings, label: "Settings" },
        { href: "/app-store", icon: Icon.Store, label: "App store" },
      ],
    },
  },
];

/**
 * App keys that are installed by default for new tenants (non-core installable apps).
 * Existing tenants with no CompanyApp records fall back to this set.
 */
export const DEFAULT_APP_KEYS: string[] = [
  "listings",
  "crm",
  "hr",
  "analytics",
];

/**
 * Returns the subset of APP_REGISTRY that should be shown based on installed keys.
 * Core apps are always included regardless of installedKeys.
 */
export function getActiveApps(installedKeys: string[]): AppDefinition[] {
  return APP_REGISTRY.filter(
    (app) => app.isCore || installedKeys.includes(app.key),
  );
}

/**
 * Returns only the installable (non-core) apps for display in the App Store.
 */
export function getInstallableApps(): AppDefinition[] {
  return APP_REGISTRY.filter((app) => !app.isCore);
}
