"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevTenantFab must not be imported in production.");
}

import { DevFabShell } from "./dev-fab-shell";

type Tenant = {
  id: string;
  name: string;
  planTier: string;
  subdomain: string;
};

export function DevTenantFab({ tenants }: { tenants: Tenant[] }) {
  return (
    <DevFabShell label="Tenants">
      <div className="divide-y divide-amber-100 dark:divide-amber-900/50">
        {tenants.length === 0 && (
          <p className="px-4 py-3 font-mono text-xs text-amber-600 dark:text-amber-400">
            No active tenants found.
          </p>
        )}
        {tenants.map((tenant) => (
          <button
            key={tenant.id}
            type="button"
            onClick={() =>
              window.open(`https://${tenant.subdomain}.plotkeys.com`, "_blank")
            }
            className="w-full px-4 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
          >
            <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
              {tenant.name}
            </p>
            <p className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
              {tenant.subdomain}.plotkeys.com
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
