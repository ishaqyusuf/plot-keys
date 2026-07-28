"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { useState } from "react";
import { DomainSection } from "@/components/domains/domain-section";
import { DomainsEmptyState } from "@/components/domains/domains-empty-states";
import {
  DomainActionsCell,
  DomainHostnameCell,
  DomainLastErrorCell,
  type DomainRecord,
  DomainStatusCell,
  formatDomainDate,
} from "@/components/domains/domains-table-cells";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type DnsInstruction = RouterOutputs["domains"]["dnsInstructions"][number];

export function DomainControlCard({
  allProvisioned,
  companyName,
  domainProvisioningConfigured,
  domains,
  hasFailure,
}: {
  allProvisioned: boolean;
  companyName: string;
  domainProvisioningConfigured: boolean;
  domains: DomainRecord[];
  hasFailure: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const syncDomainsMutation = useMutation(
    trpc.domains.sync.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to sync domains.");
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

  return (
    <DomainSection
      description="Sync statuses, connect new hostnames, and keep provisioning moving."
      title="Domain control"
    >
      <div className="flex flex-col gap-4 border bg-background p-5">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium">
            {allProvisioned
              ? "All domains are active"
              : hasFailure
                ? "One or more domains have errors"
                : "Domains are pending provisioning"}
          </p>
          <p className="text-sm text-muted-foreground">
            {domains.length === 0
              ? "No domain records found for this workspace."
              : `${domains.length} domain${domains.length === 1 ? "" : "s"} tracked for ${companyName}.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton
            disabled={
              !domainProvisioningConfigured || syncDomainsMutation.isPending
            }
            isSubmitting={syncDomainsMutation.isPending}
            onClick={() => syncDomainsMutation.mutate()}
            type="button"
            variant={hasFailure ? "default" : "secondary"}
          >
            {hasFailure ? "Retry failed domains" : "Sync all domains"}
          </SubmitButton>
          <Button asChild>
            <Link href="/domains/connect">Connect custom domain</Link>
          </Button>
          {error ? (
            <Alert variant="destructive" className="w-full px-3 py-2">
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          ) : null}
          {!domainProvisioningConfigured ? (
            <p className="mt-3 w-full text-xs text-muted-foreground">
              Set <code>VERCEL_API_TOKEN</code> and <code>VERCEL_TEAM_ID</code>{" "}
              environment variables to enable domain provisioning.
            </p>
          ) : null}
        </div>
      </div>
    </DomainSection>
  );
}

export function DomainDnsInstructions({
  instructions,
}: {
  instructions: DnsInstruction[];
}) {
  const pendingInstructions = instructions.filter(
    (domain) => domain.status === "pending" || domain.status === "provisioning",
  );

  if (pendingInstructions.length === 0) {
    return null;
  }

  return (
    <DomainSection
      description="Complete these records at your DNS provider, then sync again to verify the custom hostname."
      title="DNS configuration required"
    >
      {pendingInstructions.map((domain) => (
        <div className="border bg-background p-5" key={domain.id}>
          <div className="mb-4">
            <p className="text-sm font-semibold">{domain.hostname}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {domain.instructions.message}
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[44rem] text-xs">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="px-0 pb-2 font-medium text-muted-foreground">
                    Type
                  </TableHead>
                  <TableHead className="pb-2 font-medium text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="px-0 pb-2 font-medium text-muted-foreground">
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domain.instructions.records.map((record) => (
                  <TableRow
                    className="border-border hover:bg-muted"
                    key={`${record.type}-${record.name}-${record.value}`}
                  >
                    <TableCell className="px-0 py-2 pr-4">
                      <Badge variant="outline" className="text-xs">
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 pr-4 font-mono text-xs">
                      {record.name}
                    </TableCell>
                    <TableCell className="px-0 py-2 font-mono text-xs break-all">
                      {record.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {domain.lastError ? (
            <Alert variant="destructive" className="mt-3 px-3 py-2">
              <AlertDescription className="text-xs">
                {domain.lastError}
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      ))}
    </DomainSection>
  );
}

export function ProvisionedDomainsTable({
  domains,
}: {
  domains: DomainRecord[];
}) {
  return (
    <DomainSection
      description="Review live hostnames, identify failures quickly, and remove stale custom domains when necessary."
      title="Provisioned domains"
    >
      {domains.length === 0 ? (
        <DomainsEmptyState />
      ) : (
        <div className="overflow-hidden border bg-background">
          <div className="overflow-x-auto">
            <Table className="min-w-[62rem]">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="px-5 py-3">Hostname</TableHead>
                  <TableHead className="py-3">Status</TableHead>
                  <TableHead className="py-3">Provisioned</TableHead>
                  <TableHead className="py-3">Last error</TableHead>
                  <TableHead className="px-5 py-3 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow
                    className="border-border hover:bg-muted"
                    key={domain.id}
                  >
                    <TableCell className="px-5 py-3">
                      <DomainHostnameCell domain={domain} />
                    </TableCell>
                    <TableCell className="py-3">
                      <DomainStatusCell status={domain.status} />
                    </TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">
                      {formatDomainDate(domain.provisionedAt)}
                    </TableCell>
                    <TableCell className="py-3">
                      <DomainLastErrorCell error={domain.lastError} />
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right">
                      <div className="flex justify-end">
                        <DomainActionsCell domain={domain} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </DomainSection>
  );
}
