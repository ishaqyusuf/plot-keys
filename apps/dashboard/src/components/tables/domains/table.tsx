"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@plotkeys/ui/table";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { syncDomainsAction } from "@/app/actions";
import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import {
  type DomainRecord,
  DomainActionsCell,
  DomainHostnameCell,
  DomainLastErrorCell,
  DomainStatusCell,
  formatDomainDate,
} from "./columns";
import { DomainsEmptyState } from "./empty-states";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type DnsInstruction =
  RouterOutputs["workspace"]["getCustomDomainDnsInstructions"][number];

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
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Domain control</DashboardSectionTitle>
          <DashboardSectionDescription>
            Sync statuses, connect new hostnames, and keep provisioning moving.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/65 bg-card/78">
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-base">
            {allProvisioned
              ? "All domains are active"
              : hasFailure
                ? "One or more domains have errors"
                : "Domains are pending provisioning"}
          </CardTitle>
          <CardDescription>
            {domains.length === 0
              ? "No domain records found for this workspace."
              : `${domains.length} domain${domains.length === 1 ? "" : "s"} tracked for ${companyName}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 px-5 pb-5 pt-0">
          <form action={syncDomainsAction}>
            <Button
              disabled={!domainProvisioningConfigured}
              type="submit"
              variant={hasFailure ? "default" : "secondary"}
            >
              {hasFailure ? "Retry failed domains" : "Sync all domains"}
            </Button>
          </form>
          <Button asChild>
            <Link href="/domains/connect">Connect custom domain</Link>
          </Button>
          {!domainProvisioningConfigured ? (
            <p className="mt-3 w-full text-xs text-muted-foreground">
              Set <code>VERCEL_API_TOKEN</code> and{" "}
              <code>VERCEL_TEAM_ID</code> environment variables to enable domain
              provisioning.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function DomainDnsInstructions({
  instructions,
}: {
  instructions: DnsInstruction[];
}) {
  const pendingInstructions = instructions.filter(
    (domain) =>
      domain.status === "pending" || domain.status === "provisioning",
  );

  if (pendingInstructions.length === 0) {
    return null;
  }

  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>DNS configuration required</DashboardSectionTitle>
          <DashboardSectionDescription>
            Complete these records at your DNS provider, then sync again to
            verify the custom hostname.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      {pendingInstructions.map((domain) => (
        <Card
          className="border-amber-300/60 bg-amber-50/35 dark:border-amber-900/70 dark:bg-amber-950/15"
          key={domain.id}
        >
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-sm font-semibold">
              {domain.hostname}
            </CardTitle>
            <CardDescription className="text-xs">
              {domain.instructions.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            <Table className="min-w-[44rem] text-xs">
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
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
                    className="border-border/50 hover:bg-muted/30"
                    key={`${record.type}-${record.name}-${record.value}`}
                  >
                    <TableCell className="px-0 py-2 pr-4">
                      <Badge className="text-xs" variant="outline">
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
            {domain.lastError ? (
              <div className="mt-3 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {domain.lastError}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </DashboardSection>
  );
}

export function ProvisionedDomainsTable({
  domains,
}: {
  domains: DomainRecord[];
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Provisioned domains</DashboardSectionTitle>
          <DashboardSectionDescription>
            Review live hostnames, identify failures quickly, and remove stale
            custom domains when necessary.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      {domains.length === 0 ? (
        <DomainsEmptyState />
      ) : (
        <div className="overflow-hidden rounded-[1.25rem] border border-border/65 bg-card/78">
          <div className="overflow-x-auto">
            <Table className="min-w-[62rem]">
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
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
                    className="border-border/50 hover:bg-muted/30"
                    key={domain.id}
                  >
                    <TableCell className="px-5 py-3">
                      <DomainHostnameCell domain={domain} />
                    </TableCell>
                    <TableCell className="py-3">
                      <DomainStatusCell status={domain.status} />
                    </TableCell>
                    <TableCell className="py-3 text-muted-foreground text-sm">
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
    </DashboardSection>
  );
}
