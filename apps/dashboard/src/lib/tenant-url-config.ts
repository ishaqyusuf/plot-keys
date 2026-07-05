import type { TenantUrlConfig } from "@plotkeys/utils/tenant-url";

export function getDashboardTenantUrlConfig(): TenantUrlConfig {
  const appRootDomain =
    process.env.NODE_ENV === "production"
      ? (process.env.PLOTKEYS_ROOT_DOMAIN?.trim() ?? "plotkeys.com")
      : (process.env.DASHBOARD_TENANT_ROOT_DOMAIN?.trim() ??
        process.env.PLOTKEYS_LOCAL_ROOT_DOMAIN?.trim() ??
        "plotkeys.localhost");

  return {
    appRootDomain,
    enablePathStyleHosts: process.env.NODE_ENV !== "production",
    internalPrefix: "",
    pathStyleHosts: ["localhost", "127.0.0.1", "0.0.0.0"],
    projectSlug: process.env.TENANT_URL_PROJECT_SLUG ?? "plotkeys",
    reservedPaths: [
      "api",
      "_next",
      "agents",
      "ai-credits",
      "analytics",
      "appointments",
      "auth",
      "billing",
      "blog",
      "builder",
      "customers",
      "domains",
      "estates",
      "favicon",
      "hr",
      "integrations",
      "join",
      "leads",
      "live",
      "notifications",
      "onboarding",
      "projects",
      "properties",
      "reports",
      "settings",
      "sign-in",
      "sign-up",
      "team",
      "template-sandbox",
      "verify-email",
    ],
  };
}
