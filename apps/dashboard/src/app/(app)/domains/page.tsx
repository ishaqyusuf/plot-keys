import { createPrismaClient, listTenantDomainsForCompany } from "@plotkeys/db";
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
import { isVercelDomainProvisioningConfigured } from "@plotkeys/utils";
import Link from "next/link";
import { requireOnboardedSession } from "../../../lib/session";
import { syncDomainsAction } from "../../actions";

type DomainsPageProps = {
  searchParams?: Promise<{ error?: string; synced?: string }>;
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

  const domainProvisioningConfigured = isVercelDomainProvisioningConfigured();
  const hasFailure = domains.some((d) => d.status === "failed");
  const allActive = domains.length > 0 && domains.every((d) => d.status === "active");

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

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Domains</h1>
            <p className="mt-2 text-muted-foreground">
              Manage and monitor the hostnames provisioned for your workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={domainProvisioningConfigured ? "default" : "outline"}>
              {domainProvisioningConfigured ? "Vercel ready" : "Vercel env needed"}
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
          <CardContent className="px-6 pb-6">
            <form action={syncDomainsAction}>
              <Button
                type="submit"
                variant={hasFailure ? "default" : "secondary"}
                disabled={!domainProvisioningConfigured}
              >
                {hasFailure ? "Retry failed domains" : "Sync all domains"}
              </Button>
            </form>
            {!domainProvisioningConfigured && (
              <p className="mt-3 text-xs text-muted-foreground">
                Set <code>VERCEL_API_TOKEN</code> and{" "}
                <code>VERCEL_TEAM_ID</code> environment variables to enable
                domain provisioning.
              </p>
            )}
          </CardContent>
        </Card>

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
            {domains.map((domain) => (
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
                  <Badge variant={statusVariant[domain.status] ?? "outline"}>
                    {domain.status}
                  </Badge>
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
