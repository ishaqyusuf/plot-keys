import type { GlobalNavSection } from "./types";

/**
 * Global navigation sections that are visible regardless of the active app.
 * These routes are never guarded by the app-enablement system.
 */

export const GLOBAL_TOP_ITEMS: GlobalNavSection = {
  label: "Overview",
  items: [
    { href: "/", icon: "Home", label: "Dashboard" },
    { href: "/builder", icon: "Paintbrush", label: "Builder" },
    { href: "/live", icon: "Globe", label: "Live Preview" },
  ],
};

export const GLOBAL_PLATFORM_GROUP: GlobalNavSection = {
  label: "Platform",
  items: [
    { href: "/billing", icon: "CreditCard", label: "Billing" },
    { href: "/domains", icon: "Globe", label: "Domains" },
    { href: "/notifications", icon: "Bell", label: "Notifications" },
    { href: "/settings", icon: "Settings", label: "Settings" },
    { href: "/app-store", icon: "Store", label: "App Store" },
    { href: "/integrations", icon: "Plug", label: "Integrations" },
    { href: "/team", icon: "UserRoundCog", label: "Team" },
  ],
};

/**
 * Set of route prefixes that belong to "global" (non-app) areas. Used by
 * `resolveActiveApp` to return `null` for these routes instead of matching
 * them to an app.
 */
export const GLOBAL_ROUTE_PREFIXES: readonly string[] = [
  "/builder",
  "/live",
  "/billing",
  "/domains",
  "/notifications",
  "/settings",
  "/app-store",
  "/integrations",
  "/team",
];
