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
import type { inferRouterOutputs } from "@trpc/server";
import { useSuspenseQuery } from "@tanstack/react-query";
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
} from "@/components/dashboard/dashboard-page";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type DashboardOverview = RouterOutputs["workspace"]["getDashboardOverview"];
type DomainStatus = DashboardOverview["domainStatuses"][number];

type DashboardHomeProps = {
  companyName: string;
  liveSiteUrl: string;
};

function formatDomainKind(kind: string) {
  return kind
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function DashboardHomeHeader({ companyName }: { companyName: string }) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Workspace overview</DashboardPageEyebrow>
          <DashboardPageTitle>{companyName}</DashboardPageTitle>
          <DashboardPageDescription>
            Track listings, team activity, site publishing, and lead flow from a
            single operating surface.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Button asChild size="sm" variant="outline">
            <Link href="/live">Preview live state</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/builder">Open builder</Link>
          </Button>
        </DashboardPageActions>
      </DashboardPageHeaderRow>
    </DashboardPageHeader>
  );
}

function PublishingControl({
  domainProvisioningConfigured,
  liveSiteUrl,
  publishedVersion,
}: {
  domainProvisioningConfigured: boolean;
  liveSiteUrl: string;
  publishedVersion: DashboardOverview["publishedVersion"];
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Publishing control</DashboardSectionTitle>
          <DashboardSectionDescription>
            Manage your public site, domain connection, and content publishing
            from one place.
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
                {publishedVersion
                  ? `Published version ${publishedVersion.versionNumber} is live.`
                  : "No published version yet."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={publishedVersion ? "default" : "outline"}>
              {publishedVersion ? "Published" : "Draft only"}
            </Badge>
            <Badge
              variant={domainProvisioningConfigured ? "secondary" : "outline"}
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
            <p className="mt-2 break-all text-sm font-medium text-foreground">
              {liveSiteUrl}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <a href={liveSiteUrl} rel="noreferrer" target="_blank">
                View site
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/domains">Manage domains</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/builder">Edit website</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

function QuickActions() {
  return (
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
            <Button asChild className="w-full" size="sm">
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
                  Review properties, appointments, and lead movement across the
                  workspace.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/properties">Properties</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/leads">Leads</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/appointments">Appointments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardSection>
  );
}

function ConnectedDomainCard({ domain }: { domain: DomainStatus }) {
  return (
    <Card className="border-border/70 bg-card/82">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="break-all text-base">
            {domain.hostname}
          </CardTitle>
          <Badge variant={domain.status === "active" ? "default" : "outline"}>
            {domain.status}
          </Badge>
        </div>
        <CardDescription>
          {formatDomainKind(domain.kind)} for {domain.apexDomain}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function ConnectedDomains({ domains }: { domains: DomainStatus[] }) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Connected domains</DashboardSectionTitle>
          <DashboardSectionDescription>
            Track connection state and identify any hostname that still needs
            attention.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        {domains.length ? (
          domains.map((domain) => (
            <ConnectedDomainCard domain={domain} key={domain.id} />
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
                <Button asChild size="sm" variant="outline">
                  <Link href="/domains">Open domains</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardSection>
  );
}

export function DashboardHome({ companyName, liveSiteUrl }: DashboardHomeProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.workspace.getDashboardOverview.queryOptions(),
  );
  const stats = [
    {
      href: "/properties",
      icon: Building2,
      label: "Properties",
      value: data.counts.propertyCount,
    },
    {
      href: "/agents",
      icon: Users,
      label: "Agents",
      value: data.counts.agentCount,
    },
    {
      href: "/leads",
      icon: Mail,
      label: "Leads",
      value: data.counts.leadCount,
    },
    {
      href: "/appointments",
      icon: Calendar,
      label: "Appointments",
      value: data.counts.appointmentCount,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <DashboardHomeHeader companyName={companyName} />

      <DashboardStatGrid>
        {stats.map((stat) => (
          <DashboardStatCard
            href={stat.href}
            icon={stat.icon}
            key={stat.label}
            label={stat.label}
            meta="Open"
            value={stat.value}
          />
        ))}
      </DashboardStatGrid>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PublishingControl
          domainProvisioningConfigured={data.domainProvisioningConfigured}
          liveSiteUrl={liveSiteUrl}
          publishedVersion={data.publishedVersion}
        />
        <QuickActions />
      </div>

      <ConnectedDomains domains={data.domainStatuses} />
    </div>
  );
}
