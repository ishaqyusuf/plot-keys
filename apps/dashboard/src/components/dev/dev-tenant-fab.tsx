"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevTenantFab must not be imported in production.");
}

import { Button } from "@plotkeys/ui/button";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { buildTenantSiteUrl } from "@plotkeys/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTRPC } from "@/trpc/client";
import { DevFabShell } from "./dev-fab-shell";

const loadingRows = ["primary", "secondary", "tertiary"] as const;

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
      <div className="divide-y divide-border">
        {isLoading && (
          <div
            className="space-y-3 px-4 py-3"
            aria-label="Loading tenants"
            role="status"
          >
            {loadingRows.map((row) => (
              <div className="space-y-1.5" key={row}>
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-14" />
              </div>
            ))}
          </div>
        )}
        {isError && (
          <p className="px-4 py-3 font-mono text-xs text-destructive">
            Failed to load tenants.
          </p>
        )}
        {!isLoading && !isError && tenantLinks.length === 0 && (
          <p className="px-4 py-3 font-mono text-xs text-muted-foreground">
            No active tenants found.
          </p>
        )}
        {tenantLinks.map((tenant) => (
          <Button
            variant="ghost"
            key={tenant.id}
            type="button"
            onClick={() => window.open(tenant.url, "_blank")}
            className="h-auto w-full flex-col items-start rounded-none px-4 py-2.5 text-left hover:bg-muted active:bg-muted"
          >
            <p className="font-mono text-xs font-semibold text-foreground">
              {tenant.name}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {tenant.url.replace(/^https?:\/\//, "")}
            </p>
            <p className="font-mono text-[10px] capitalize text-muted-foreground">
              {tenant.planTier}
            </p>
          </Button>
        ))}
      </div>
    </DevFabShell>
  );
}
