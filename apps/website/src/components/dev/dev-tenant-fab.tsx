"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevTenantFab must not be imported in production.");
}

import { buildTenantDashboardUrl, buildTenantSiteUrl } from "@plotkeys/utils";
import { useMemo } from "react";

import { DevFabShell } from "./dev-fab-shell";

type Tenant = {
  hostname?: string | null;
  id: string;
  name: string;
  planTier: string;
  subdomain: string;
};

export function DevTenantFab({ tenants }: { tenants: Tenant[] }) {
  const currentOrigin =
    typeof window === "undefined" ? null : window.location.origin;

  const tenantLinks = useMemo(
    () =>
      tenants.map((tenant) => ({
        dashboardUrl: buildTenantDashboardUrl(tenant.subdomain, {
          currentOrigin,
          tenantHostname: tenant.hostname,
        }),
        ...tenant,
        siteUrl: buildTenantSiteUrl(tenant.subdomain, {
          currentOrigin,
          tenantHostname: tenant.hostname,
        }),
      })),
    [currentOrigin, tenants],
  );

  return (
    <DevFabShell label="Tenants">
      <div className="divide-y divide-amber-100 dark:divide-amber-900/50">
        {tenantLinks.length === 0 && (
          <p className="px-4 py-3 font-mono text-xs text-amber-600 dark:text-amber-400">
            No active tenants found.
          </p>
        )}
        {tenantLinks.map((tenant) => (
          <div
            key={tenant.id}
            className="px-4 py-2.5 transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
          >
            <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
              {tenant.name}
            </p>
            <p className="font-mono text-[10px] capitalize text-slate-400">
              {tenant.planTier}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => window.open(tenant.siteUrl, "_blank")}
                className="rounded border border-amber-200 px-2 py-1 font-mono text-[10px] text-amber-700 dark:border-amber-900/50 dark:text-amber-400"
              >
                Site
              </button>
              <button
                type="button"
                onClick={() => window.open(tenant.dashboardUrl, "_blank")}
                className="rounded border border-amber-200 px-2 py-1 font-mono text-[10px] text-amber-700 dark:border-amber-900/50 dark:text-amber-400"
              >
                Dashboard
              </button>
            </div>
            <p className="mt-2 font-mono text-[10px] text-amber-700 dark:text-amber-400">
              {tenant.siteUrl.replace(/^https?:\/\//, "")}
            </p>
            <p className="font-mono text-[10px] text-slate-400">
              {tenant.dashboardUrl.replace(/^https?:\/\//, "")}
            </p>
          </div>
        ))}
      </div>
    </DevFabShell>
  );
}
