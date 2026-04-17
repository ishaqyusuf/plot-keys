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
import {
  buildTenantSiteUrl,
  isVercelDomainProvisioningConfigured,
} from "@plotkeys/utils";
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
import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardStatCard,
  DashboardStatGrid,
} from "../../components/dashboard/dashboard-page";
import { DevTenantFabLoader } from "../../components/dev/dev-tenant-fab-loader";
import { getBaseUrl } from "../../lib/get-base-url";
import { requireOnboardedSession } from "../../lib/session";
import { ensureBuilderConfigurationExists } from "../actions";

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
  const currentOrigin = await getBaseUrl();
  const liveSiteUrl = buildTenantSiteUrl(session.activeMembership.companySlug, {
    currentOrigin,
  });

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
      href: "/properties",
      icon: Building2,
      label: "Properties",
      value: propertyCount ?? 0,
    },
    { href: "/agents", icon: Users, label: "Agents", value: agentCount ?? 0 },
    { href: "/leads", icon: Mail, label: "Leads", value: leadCount ?? 0 },
    {
      href: "/appointments",
      icon: Calendar,
      label: "Appointments",
      value: appointmentCount ?? 0,
    },
  ];

  return (
    <>
      <DashboardPage>
        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <DashboardPageHeader>
          <DashboardPageHeaderRow>
            <DashboardPageIntro>
              <DashboardPageEyebrow>Workspace Overview</DashboardPageEyebrow>
              <DashboardPageTitle>
                {session.activeMembership.companyName}
              </DashboardPageTitle>
              <DashboardPageDescription>
                Track your listings, team activity, site publishing, and lead
                flow from a single Midday-style operating surface.
              </DashboardPageDescription>
            </DashboardPageIntro>
            <DashboardPageActions>
              <Button asChild variant="outline">
                <Link href="/live">Preview live state</Link>
              </Button>
              <Button asChild>
                <Link href="/builder">Open builder</Link>
              </Button>
            </DashboardPageActions>
          </DashboardPageHeaderRow>
        </DashboardPageHeader>

        <DashboardStatGrid>
          {stats.map((stat) => {
            return (
              <DashboardStatCard
                key={stat.label}
                href={stat.href}
                icon={stat.icon}
                label={stat.label}
                meta="Open"
                value={stat.value}
              />
            );
          })}
        </DashboardStatGrid>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <DashboardSection>
            <DashboardSectionHeader>
              <div>
                <DashboardSectionTitle>
                  Publishing control
                </DashboardSectionTitle>
                <DashboardSectionDescription>
                  Manage your public site, domain connection, and content
                  publishing from one place.
                </DashboardSectionDescription>
              </div>
            </DashboardSectionHeader>

            <Card className="border-border/65 bg-card/78">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-[1rem] bg-primary/10 text-primary">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Site status</CardTitle>
                    <CardDescription>
                      {publishedConfig
                        ? `Published version ${publishedConfig.versionNumber} is live.`
                        : "No published version yet."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={publishedConfig ? "default" : "outline"}>
                    {publishedConfig ? "Published" : "Draft only"}
                  </Badge>
                  <Badge
                    variant={
                      domainProvisioningConfigured ? "secondary" : "outline"
                    }
                  >
                    {domainProvisioningConfigured
                      ? "Domain provisioning ready"
                      : "Provisioning not configured"}
                  </Badge>
                </div>
                <div className="rounded-[1rem] border border-border/60 bg-background/55 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                    Primary URL
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {liveSiteUrl}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <a href={liveSiteUrl} rel="noreferrer" target="_blank">
                      View site
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/domains">Manage domains</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/builder">Edit website</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </DashboardSection>

          <DashboardSection>
            <DashboardSectionHeader>
              <div>
                <DashboardSectionTitle>Quick actions</DashboardSectionTitle>
                <DashboardSectionDescription>
                  The highest-value next actions for your workspace.
                </DashboardSectionDescription>
              </div>
            </DashboardSectionHeader>

            <div className="grid gap-2.5">
              <Card className="border-border/65 bg-card/78">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-[1rem] bg-primary/10 text-primary">
                      <Paintbrush className="size-5" />
                    </div>
                    <div>
                      <CardTitle>Refresh your site experience</CardTitle>
                      <CardDescription>
                        Update content, theme, and homepage structure inside the
                        builder.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/builder">Open builder workspace</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/65 bg-card/78">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-[1rem] bg-primary/10 text-primary">
                      <BarChart3 className="size-5" />
                    </div>
                    <div>
                      <CardTitle>Inspect operations</CardTitle>
                      <CardDescription>
                        Review properties, appointments, and lead movement
                        across the workspace.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <Link href="/properties">Properties</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/leads">Leads</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/appointments">Appointments</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </DashboardSection>
        </div>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Connected domains</DashboardSectionTitle>
              <DashboardSectionDescription>
                Track connection state and identify any hostname that still
                needs attention.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          <div className="grid gap-4 lg:grid-cols-2">
            {(domainStatuses ?? []).length ? (
              domainStatuses!.map((domain) => (
                <Card key={domain.id} className="border-border/70 bg-card/82">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-base">
                        {domain.hostname}
                      </CardTitle>
                      <Badge
                        variant={
                          domain.status === "active" ? "default" : "outline"
                        }
                      >
                        {domain.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {domain.kind} domain for {domain.apexDomain}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card className="border-border/70 bg-card/82 lg:col-span-2">
                <CardContent className="flex flex-col gap-3 py-8">
                  <p className="text-sm font-medium text-foreground">
                    No connected domains yet.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Start with your PlotKeys subdomain, then connect a custom
                    hostname when you are ready.
                  </p>
                  <div>
                    <Button asChild variant="outline">
                      <Link href="/domains">Open domains</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DashboardSection>
      </DashboardPage>
      <DevTenantFabLoader />
    </>
  );
}
