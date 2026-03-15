export const plotkeysRootDomain = "plotkeys.com";
export const dashboardSubdomainLabel = "dashboard";

export function normalizeSubdomainLabel(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildSitefrontHostname(subdomain: string) {
  return `${subdomain}.${plotkeysRootDomain}`;
}

export function buildDashboardHostname(subdomain: string) {
  return `${dashboardSubdomainLabel}.${subdomain}.${plotkeysRootDomain}`;
}

export function stripPortFromHostname(value: string) {
  return value.trim().toLowerCase().replace(/:\d+$/, "");
}

export function extractTenantHostname(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const hostname = stripPortFromHostname(value);

  if (!hostname || hostname === "localhost") {
    return null;
  }

  return hostname;
}
