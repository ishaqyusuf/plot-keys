"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";

import { removeCustomDomainAction } from "@/app/actions";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type DomainStatusData =
  RouterOutputs["workspace"]["getTenantDomainStatus"];

export type DomainRecord = DomainStatusData["domains"][number];

const statusVariant: Record<
  string,
  "default" | "outline" | "secondary" | "destructive"
> = {
  active: "default",
  detached: "outline",
  failed: "destructive",
  pending: "secondary",
  provisioning: "secondary",
};

const kindLabel: Record<string, string> = {
  dashboard_custom_domain: "Dashboard - custom domain",
  dashboard_subdomain: "Dashboard - subdomain",
  sitefront_custom_domain: "Site - custom domain",
  sitefront_subdomain: "Site - subdomain",
};

export function formatDomainDate(date: Date | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isRemovableCustomDomain(domain: DomainRecord) {
  return domain.kind === "sitefront_custom_domain";
}

export function DomainHostnameCell({ domain }: { domain: DomainRecord }) {
  return (
    <div>
      <p className="font-medium text-foreground">{domain.hostname}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {kindLabel[domain.kind] ?? domain.kind}
      </p>
    </div>
  );
}

export function DomainStatusCell({ status }: { status: string }) {
  return <Badge variant={statusVariant[status] ?? "outline"}>{status}</Badge>;
}

export function DomainLastErrorCell({ error }: { error: string | null }) {
  if (!error) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="max-w-[22rem] rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-xs">
      {error}
    </div>
  );
}

export function DomainActionsCell({ domain }: { domain: DomainRecord }) {
  if (!isRemovableCustomDomain(domain)) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <form action={removeCustomDomainAction}>
      <input name="domainId" type="hidden" value={domain.id} />
      <Button
        className="h-auto px-2 py-1 text-destructive text-xs hover:text-destructive"
        size="sm"
        type="submit"
        variant="ghost"
      >
        Remove
      </Button>
    </form>
  );
}
