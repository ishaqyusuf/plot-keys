import { createPrismaClient } from "@plotkeys/db";
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
import { requireOnboardedSession } from "../../lib/session";
import { syncTenantDomainsAction } from "../actions";

type DomainsPageProps = {
  searchParams?: Promise<{ status?: string; synced?: string; error?: string }>;
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "destructive" | "outline" | "secondary" }
> = {
  active: { label: "Active", variant: "default" },
  detached: { label: "Detached", variant: "outline" },
  failed: { label: "Failed", variant: "destructive" },
  pending: { label: "Pending", variant: "secondary" },
  provisioning: { label: "Provisioning", variant: "secondary" },
};

const kindLabels: Record<string, string> = {
  dashboard_custom_domain: "Dashboard (custom)",
  dashboard_subdomain: "Dashboard subdomain",
  sitefront_custom_domain: "Sitefront (custom)",
  sitefront_subdomain: "Sitefront subdomain",
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function DomainsPage({
  searchParams,
}: DomainsPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filterStatus = params.status || undefined;
  const domainProvisioningConfigured = isVercelDomainProvisioningConfigured();

  const prisma = createPrismaClient().db;

  const domains = prisma
    ? await prisma.tenantDomain.findMany({
        orderBy: { createdAt: "asc" },
        where: {
          companyId: session.activeMembership.companyId,
          deletedAt: null,
          ...(filterStatus ? { status: filterStatus as never } : {}),
        },
      })
    : [];

  const counts = prisma
    ? await prisma.tenantDomain.groupBy({
        by: ["status"],
        _count: true,
        where: {
          companyId: session.activeMembership.companyId,
          deletedAt: null,
        },
      })
    : [];

  const stats: Record<string, number> = {
    active: counts.find((c) => c.status === "active")?._count ?? 0,
    detached: counts.find((c) => c.status === "detached")?._count ?? 0,
    failed: counts.find((c) => c.status === "failed")?._count ?? 0,
    pending: counts.find((c) => c.status === "pending")?._count ?? 0,
    provisioning: counts.find((c) => c.status === "provisioning")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };

  const hasFailure = domains.some((d) => d.status === "failed");
  const allProvisioned =
    domains.length > 0 && domains.every((d) => d.status === "active");

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {params.error ? (
          <div className="mb-6 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {params.error}
          </div>
        ) : null}

        {params.synced ? (
          <div className="mb-6 rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
            Domain sync has been queued. Refresh this page in a few moments to
            see updated statuses.
          </div>
        ) : null}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="ghost">
                <Link href="/">← Dashboard</Link>
              </Button>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
              Domains
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} domain{stats.total !== 1 ? "s" : ""} configured
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={domainProvisioningConfigured ? "default" : "outline"}>
              {domainProvisioningConfigured ? "Vercel ready" : "Vercel env needed"}
            </Badge>
          </div>
        </div>

        {/* Summary strip */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card className="bg-card">
            <CardContent className="px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Total
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {stats.total}
              </p>
            </CardContent>
          </Card>
          <Card className={allProvisioned ? "border-primary/30 bg-primary/5" : "bg-card"}>
            <CardContent className="px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Active
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {stats.active}
              </p>
            </CardContent>
          </Card>
          <Card className={hasFailure ? "border-destructive/30 bg-destructive/5" : "bg-card"}>
            <CardContent className="px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Failed
              </p>
              <p className="mt-1 text-2xl font-semibold text-destructive">
                {stats.failed}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status filter buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!filterStatus ? "default" : "outline"}
          >
            <Link href="/domains">All ({stats.total})</Link>
          </Button>
          {(
            ["active", "pending", "provisioning", "failed", "detached"] as const
          ).map((s) =>
            (stats[s] ?? 0) > 0 || filterStatus === s ? (
              <Button
                key={s}
                asChild
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
              >
                <Link href={`/domains?status=${s}`}>
                  {statusConfig[s]?.label ?? s} ({stats[s] ?? 0})
                </Link>
              </Button>
            ) : null,
          )}
        </div>

        {/* Re-sync action */}
        <div className="mb-6">
          <form action={syncTenantDomainsAction}>
            <Button
              type="submit"
              variant="secondary"
              disabled={!domainProvisioningConfigured}
            >
              Provision or refresh domains
            </Button>
          </form>
        </div>

        {domains.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {filterStatus
                  ? `No ${filterStatus} domains.`
                  : "No domains configured yet. Domains are created automatically during onboarding."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {domains.map((domain) => (
              <Card key={domain.id} className="bg-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {domain.hostname}
                      </CardTitle>
                      <Badge
                        variant={
                          statusConfig[domain.status]?.variant ?? "outline"
                        }
                      >
                        {statusConfig[domain.status]?.label ?? domain.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {kindLabels[domain.kind] ?? domain.kind}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {domain.status === "active" ? (
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={`https://${domain.hostname}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit ↗
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-5">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      Vercel project: {domain.vercelProjectKey}
                    </span>
                    {domain.provisionedAt ? (
                      <span>
                        Provisioned: {formatDate(domain.provisionedAt)}
                      </span>
                    ) : null}
                    <span>Created: {formatDate(domain.createdAt)}</span>
                  </div>
                  {domain.lastError ? (
                    <p className="mt-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                      {domain.lastError}
                    </p>
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
