import { createPrismaClient } from "@plotkeys/db";
import { resolvePublishedForCompany } from "@plotkeys/db/queries/website";
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
import { Separator } from "@plotkeys/ui/separator";
import { isVercelDomainProvisioningConfigured } from "@plotkeys/utils";
import {
  BarChart3,
  Building2,
  Calendar,
  Globe,
  Mail,
  Paintbrush,
  Users,
} from "lucide-react";
import Link from "next/link";
import { DevTenantFabLoader } from "../../components/dev/dev-tenant-fab-loader";
import { requireOnboardedSession } from "../../lib/session";
import {
  ensureBuilderConfigurationExists,
  syncTenantDomainsAction,
} from "../actions";

type DashboardHomePageProps = {
  searchParams?: Promise<{
    domains?: string;
    error?: string;
  }>;
};

export default async function DashboardHomePage({
  searchParams,
}: DashboardHomePageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  await ensureBuilderConfigurationExists();

  const prisma = createPrismaClient().db;
  const domainProvisioningConfigured = isVercelDomainProvisioningConfigured();

  const [
    domainStatuses,
    propertyCount,
    agentCount,
    leadCount,
    appointmentCount,
    publishedConfig,
  ] = await Promise.all([
    prisma?.tenantDomain.findMany({
      orderBy: { createdAt: "asc" },
      where: {
        companyId: session.activeMembership.companyId,
        deletedAt: null,
      },
    }),
    prisma?.property.count({
      where: { companyId: session.activeMembership.companyId, deletedAt: null },
    }),
    prisma?.agent.count({
      where: { companyId: session.activeMembership.companyId, deletedAt: null },
    }),
    prisma?.lead.count({
      where: { companyId: session.activeMembership.companyId },
    }),
    prisma?.appointment.count({
      where: { companyId: session.activeMembership.companyId },
    }),
    prisma
      ? resolvePublishedForCompany(prisma, session.activeMembership.companyId)
      : null,
  ]);

  const stats = [
    {
      label: "Properties",
      value: propertyCount ?? 0,
      href: "/properties",
      icon: Building2,
    },
    { label: "Agents", value: agentCount ?? 0, href: "/agents", icon: Users },
    { label: "Leads", value: leadCount ?? 0, href: "/leads", icon: Mail },
    {
      label: "Appointments",
      value: appointmentCount ?? 0,
      href: "/appointments",
      icon: Calendar,
    },
  ];

  return (
    <>
      <DevTenantFabLoader />
      <main className="px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-6xl">
        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.domains ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Tenant domain sync completed.</AlertDescription>
          </Alert>
        ) : null}

        {(() => {
          const domains = domainStatuses ?? [];
          const failedDomains = domains.filter((d) => d.status === "failed");
          const pendingDomains = domains.filter(
            (d) => d.status === "pending" || d.status === "provisioning",
          );

          if (failedDomains.length === 0 && pendingDomains.length === 0) {
            return null;
          }

          return (
            <div className="mb-6 flex flex-col gap-3">
              {failedDomains.length > 0 ? (
                <Alert variant="destructive">
                  <AlertDescription className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {failedDomains.length} domain
                      {failedDomains.length > 1 ? "s" : ""} failed
                      provisioning:{" "}
                      {failedDomains.map((d) => d.hostname).join(", ")}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/domains">View domains</Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : null}
              {pendingDomains.length > 0 ? (
                <Alert className="border-amber-500/20 bg-amber-500/10 text-foreground">
                  <AlertDescription className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {pendingDomains.length} domain
                      {pendingDomains.length > 1 ? "s" : ""} awaiting
                      provisioning:{" "}
                      {pendingDomains.map((d) => d.hostname).join(", ")}
                    </span>
                    <form action={syncTenantDomainsAction}>
                      <Button size="sm" type="submit" variant="outline">
                        Provision now
                      </Button>
                    </form>
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          );
        })()}

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Welcome back, {session.activeMembership.companyName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your website, listings, and business from one place.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="h-full cursor-pointer bg-card transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <stat.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-2xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Jump to the most common tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {[
                {
                  title: "Open builder",
                  description: "Edit your website template and content",
                  href: "/builder",
                  icon: Paintbrush,
                },
                {
                  title: "View live site",
                  description: "Preview your published website",
                  href: `/live?subdomain=${session.activeMembership.companySlug}`,
                  icon: Globe,
                },
                {
                  title: "Manage properties",
                  description: "Add or update your property listings",
                  href: "/properties",
                  icon: Building2,
                },
                {
                  title: "View analytics",
                  description: "See website traffic and visitor activity",
                  href: "/analytics",
                  icon: BarChart3,
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <action.icon className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Site Status</CardTitle>
              <CardDescription>
                Your website configuration and domain status.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Published template
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {publishedConfig?.name ?? "No template published yet"}
                  </p>
                </div>
                <Badge variant={publishedConfig ? "default" : "outline"}>
                  {publishedConfig ? "Live" : "Draft"}
                </Badge>
              </div>

              {publishedConfig && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Last published
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {publishedConfig.publishedAt
                        ? new Date(
                            publishedConfig.publishedAt,
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not published yet"}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Domain provisioning
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(domainStatuses ?? []).length} domain
                    {(domainStatuses ?? []).length !== 1 ? "s" : ""} configured
                  </p>
                </div>
                <Badge
                  variant={domainProvisioningConfigured ? "default" : "outline"}
                >
                  {domainProvisioningConfigured ? "Ready" : "Setup needed"}
                </Badge>
              </div>

              {(domainStatuses ?? []).map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {domain.hostname}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {domain.kind}
                    </p>
                  </div>
                  <Badge
                    className={
                      domain.status === "failed"
                        ? "border-destructive/20 bg-destructive/10 text-destructive"
                        : undefined
                    }
                    variant={domain.status === "active" ? "default" : "outline"}
                  >
                    {domain.status}
                  </Badge>
                </div>
              ))}

              <form action={syncTenantDomainsAction}>
                <Button className="w-full" size="sm" type="submit" variant="outline">
                  Provision or refresh domains
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </main>
    </>
  );
}
