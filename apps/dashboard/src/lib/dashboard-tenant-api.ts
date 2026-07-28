import "server-only";

import { buildApiUrl } from "@plotkeys/utils";

type DashboardTenantState = {
  onboarded: boolean;
  tenantSlug: string | null;
};

export async function getDashboardTenantState(input: {
  tenantHostname: string | null;
  tenantSlug: string | null;
}): Promise<DashboardTenantState | null> {
  const url = new URL(buildApiUrl({ path: "/api/dashboard-tenants/state" }));

  if (input.tenantHostname) {
    url.searchParams.set("hostname", input.tenantHostname);
  }
  if (input.tenantSlug) {
    url.searchParams.set("slug", input.tenantSlug);
  }

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) return null;

    const data = (await response.json()) as Partial<DashboardTenantState>;

    if (
      typeof data.onboarded !== "boolean" ||
      (data.tenantSlug !== null && typeof data.tenantSlug !== "string")
    ) {
      return null;
    }

    return {
      onboarded: data.onboarded,
      tenantSlug: data.tenantSlug,
    };
  } catch {
    return null;
  }
}
