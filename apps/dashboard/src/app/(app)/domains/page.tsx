import {
  createPrismaClient,
  listCustomDomainsWithVerification,
  listTenantDomainsForCompany,
} from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
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
  buildDnsInstructions,
  isVercelDomainProvisioningConfigured,
} from "@plotkeys/utils";
import Link from "next/link";
import { requireOnboardedSession } from "../../../lib/session";
import { removeCustomDomainAction, syncDomainsAction } from "../../actions";

type DomainsPageProps = {
  searchParams?: Promise<{
    error?: string;
    synced?: string;
    connected?: string;
    removed?: string;
  }>;
};

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
  dashboard_custom_domain: "Dashboard — custom domain",
  dashboard_subdomain: "Dashboard — subdomain",
  sitefront_custom_domain: "Site — custom domain",
  sitefront_subdomain: "Site — subdomain",
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function DomainsPage({ searchParams }: DomainsPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;
  const domains = prisma
    ? await listTenantDomainsForCompany(
        prisma,
        session.activeMembership.companyId,
      )
    : [];

  const customDomains = prisma
    ? await listCustomDomainsWithVerification(
        prisma,
        session.activeMembership.companyId,
      )
    : [];

  // Build DNS instructions for pending/provisioning custom domains
  const pendingCustomDomains = customDomains
    .filter(
      (d) =>
        d.kind === "sitefront_custom_domain" &&
        (d.status === "pending" || d.status === "provisioning"),
    )
    .map((d) => {
      const verificationChallenges = Array.isArray(d.verificationJson)
        ? (d.verificationJson as Array<{
            type: string;
            domain: string;
            value: string;
          }>)
        : undefined;
      return {
        ...d,
        instructions: buildDnsInstructions(d.hostname, verificationChallenges),
      };
    });

  const domainProvisioningConfigured = isVercelDomainProvisioningConfigured();
  const hasFailure = domains.some((d) => d.status === "failed");
  const allActive =
    domains.length > 0 && domains.every((d) => d.status === "active");

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl">
        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.synced ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>
              Domain sync queued. Refresh the page in a few moments to check
              updated statuses.
            </AlertDescription>
          </Alert>
        ) : null}

        {params.connected ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>
              Custom domain connected! Configure the DNS records below, then
              sync to verify.
            </AlertDescription>
          </Alert>
        ) : null}

        {params.removed ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>
              Custom domain removed successfully.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Domains</h1>
            <p className="mt-2 text-muted-foreground">
              Manage and monitor the hostnames provisioned for your workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={domainProvisioningConfigured ? "default" : "outline"}
            >
              {domainProvisioningConfigured
                ? "Vercel ready"
                : "Vercel env needed"}
            </Badge>
            <Button asChild variant="secondary" size="sm">
              <Link href="/">← Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Summary card */}
        <Card className="mb-6 bg-card">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base">
              {allActive
                ? "All domains are active"
                : hasFailure
                  ? "One or more domains have errors"
                  : "Domains are pending provisioning"}
            </CardTitle>
            <CardDescription>
              {domains.length === 0
                ? "No domain records found for this workspace."
                : `${domains.length} domain${domains.length === 1 ? "" : "s"} tracked for ${session.activeMembership.companyName}.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 px-6 pb-6">
            <form action={syncDomainsAction}>
              <Button
                type="submit"
                variant={hasFailure ? "default" : "secondary"}
                disabled={!domainProvisioningConfigured}
              >
                {hasFailure ? "Retry failed domains" : "Sync all domains"}
              </Button>
            </form>
            <Button asChild>
              <Link href="/domains/connect">Connect Custom Domain</Link>
            </Button>
            {!domainProvisioningConfigured && (
              <p className="mt-3 w-full text-xs text-muted-foreground">
                Set <code>VERCEL_API_TOKEN</code> and{" "}
                <code>VERCEL_TEAM_ID</code> environment variables to enable
                domain provisioning.
              </p>
            )}
          </CardContent>
        </Card>

        {/* DNS Instructions for pending custom domains */}
        {pendingCustomDomains.length > 0 && (
          <div className="mb-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              DNS Configuration Required
            </h2>
            {pendingCustomDomains.map((d) => (
              <Card
                key={d.id}
                className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20"
              >
                <CardHeader className="px-6 pt-5 pb-3">
                  <CardTitle className="text-sm font-semibold">
                    {d.hostname}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {d.instructions.message}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="pb-2 pr-4 font-medium">Type</th>
                          <th className="pb-2 pr-4 font-medium">Name</th>
                          <th className="pb-2 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.instructions.records.map((record) => (
                          <tr
                            key={`${record.type}-${record.name}-${record.value}`}
                            className="border-b last:border-0"
                          >
                            <td className="py-2 pr-4">
                              <Badge variant="outline" className="text-xs">
                                {record.type}
                              </Badge>
                            </td>
                            <td className="py-2 pr-4 font-mono text-xs">
                              {record.name}
                            </td>
                            <td className="py-2 font-mono text-xs break-all">
                              {record.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {d.lastError && (
                    <div className="mt-3 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {d.lastError}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Domain list */}
        {domains.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="px-6 py-10 text-center text-muted-foreground">
              No domains have been provisioned yet. Complete onboarding or
              trigger a sync to create them.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {domains.map((domain) => {
              const isCustom =
                domain.kind === "sitefront_custom_domain" ||
                domain.kind === "dashboard_custom_domain";
              return (
                <Card key={domain.id} className="bg-card">
                  <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 px-6 pt-6 pb-3">
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {domain.hostname}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {kindLabel[domain.kind] ?? domain.kind}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={statusVariant[domain.status] ?? "outline"}
                      >
                        {domain.status}
                      </Badge>
                      {isCustom &&
                        domain.kind === "sitefront_custom_domain" && (
                          <form action={removeCustomDomainAction}>
                            <input
                              type="hidden"
                              name="domainId"
                              value={domain.id}
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="h-auto px-2 py-1 text-xs text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </form>
                        )}
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-2 px-6 pb-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-foreground/70">
                        Provisioned:
                      </span>
                      <span>{formatDate(domain.provisionedAt)}</span>
                    </div>
                    {domain.lastError ? (
                      <div className="mt-1 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive">
                        <p className="font-medium">Error</p>
                        <p className="mt-0.5">{domain.lastError}</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
