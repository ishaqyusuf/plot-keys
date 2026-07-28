"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";

import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type DomainStatusData = RouterOutputs["domains"]["status"];

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
    <Alert variant="destructive" className="max-w-[22rem] px-3 py-2">
      <AlertDescription className="text-xs">{error}</AlertDescription>
    </Alert>
  );
}

export function DomainActionsCell({ domain }: { domain: DomainRecord }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const removeDomainMutation = useMutation(
    trpc.domains.remove.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to remove domain.");
      },
      async onSuccess() {
        setError(null);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.domains.status.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.domains.dnsInstructions.queryKey(),
          }),
        ]);
      },
    }),
  );

  if (!isRemovableCustomDomain(domain)) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="space-y-1 text-right">
      <SubmitButton
        variant="ghost"
        className="h-auto px-2 py-1 text-xs text-destructive hover:text-destructive"
        isSubmitting={removeDomainMutation.isPending}
        onClick={() => removeDomainMutation.mutate({ domainId: domain.id })}
        size="sm"
        type="button"
      >
        Remove
      </SubmitButton>
      {error ? (
        <Alert variant="destructive" className="max-w-[14rem] px-2 py-1">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
