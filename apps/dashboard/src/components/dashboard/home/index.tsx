"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ConnectedDomains } from "@/components/dashboard/home/connected-domains";
import { DashboardHomeHeader } from "@/components/dashboard/home/header";
import { PublishingControl } from "@/components/dashboard/home/publishing-control";
import { DashboardHomeQuickActions } from "@/components/dashboard/home/quick-actions";
import { DashboardHomeStatCard } from "@/components/dashboard/home/stat-card";
import { useTRPC } from "@/trpc/client";

type Props = {
  companyName: string;
  liveSiteUrl: string;
};

export function DashboardHome({ companyName, liveSiteUrl }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.overview.summary.queryOptions());
  const stats = [
    {
      href: "/properties",
      label: "Properties",
      value: data.counts.propertyCount,
    },
    {
      href: "/agents",
      label: "Agents",
      value: data.counts.agentCount,
    },
    {
      href: "/leads",
      label: "Leads",
      value: data.counts.leadCount,
    },
    {
      href: "/appointments",
      label: "Appointments",
      value: data.counts.appointmentCount,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <DashboardHomeHeader companyName={companyName} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardHomeStatCard
            href={stat.href}
            key={stat.label}
            label={stat.label}
            meta="Open"
            value={stat.value}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PublishingControl
          domainProvisioningConfigured={data.domainProvisioningConfigured}
          liveSiteUrl={liveSiteUrl}
          publishedVersion={data.publishedVersion}
        />
        <DashboardHomeQuickActions />
      </div>

      <ConnectedDomains domains={data.domainStatuses} />
    </div>
  );
}
