"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import {
  isLeadStatus,
  type LeadStatus,
  leadStatusConfig,
  leadStatuses,
} from "@/components/leads/lead-utils";
import { useLeadFilterParams } from "@/hooks/use-lead-filter-params";
import { useTRPC } from "@/trpc/client";

export function LeadsStatusTabs() {
  const trpc = useTRPC();
  const { filter } = useLeadFilterParams();
  const statusParam = filter.status ?? undefined;
  const activeStatus: LeadStatus | undefined = isLeadStatus(statusParam)
    ? statusParam
    : undefined;
  const { data: stats } = useSuspenseQuery(trpc.leads.stats.queryOptions());

  return (
    <HeaderLinkTabList>
      <HeaderLinkTab active={!activeStatus} href="/leads">
        All ({stats.total})
      </HeaderLinkTab>
      {leadStatuses.map((status) => (
        <HeaderLinkTab
          active={activeStatus === status}
          href={`/leads?status=${status}`}
          key={status}
        >
          {leadStatusConfig[status].label} ({stats[status] ?? 0})
        </HeaderLinkTab>
      ))}
    </HeaderLinkTabList>
  );
}
