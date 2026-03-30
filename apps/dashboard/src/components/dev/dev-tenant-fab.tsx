"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevTenantFab must not be imported in production.");
}

import { buildTenantSiteUrl } from "@plotkeys/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTRPC } from "../../trpc/client";
import { DevFabShell } from "./dev-fab-shell";

export function DevTenantFab() {
  const trpc = useTRPC();
  const currentOrigin =
    typeof window === "undefined" ? null : window.location.origin;
  const {
    data: tenants = [],
    isLoading,
    isError,
  } = useQuery(trpc.dev.listTenants.queryOptions());
  const tenantLinks = useMemo(
    () =>
      tenants.map((tenant) => ({
        ...tenant,
        url: buildTenantSiteUrl(tenant.subdomain, { currentOrigin }),
      })),
    [currentOrigin, tenants],
  );

  return (
    <DevFabShell label="Tenants">
      <div className="divide-y divide-amber-100 dark:divide-amber-900/50">
        {isLoading && (
          <p className="px-4 py-3 font-mono text-xs text-amber-600 dark:text-amber-400">
            Loading tenants…
          </p>
        )}
        {isError && (
          <p className="px-4 py-3 font-mono text-xs text-red-500">
            Failed to load tenants.
          </p>
        )}
        {!isLoading && !isError && tenantLinks.length === 0 && (
          <p className="px-4 py-3 font-mono text-xs text-amber-600 dark:text-amber-400">
            No active tenants found.
          </p>
        )}
        {tenantLinks.map((tenant) => (
          <button
            key={tenant.id}
            type="button"
            onClick={() => window.open(tenant.url, "_blank")}
            className="w-full px-4 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
          >
            <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
              {tenant.name}
            </p>
            <p className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
              {tenant.url.replace(/^https?:\/\//, "")}
            </p>
            <p className="font-mono text-[10px] capitalize text-slate-400">
              {tenant.planTier}
            </p>
          </button>
        ))}
      </div>
    </DevFabShell>
  );
}
