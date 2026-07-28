"use client";

import type { LeadStatus } from "@/components/leads/lead-utils";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useLeadFilterParams } from "@/hooks/use-lead-filter-params";

type Props = {
  activeStatus?: LeadStatus;
};

export function EmptyState({ activeStatus }: Props) {
  return (
    <CoreEmptyState
      description={
        activeStatus
          ? `No ${activeStatus} leads yet.`
          : "Leads from your website contact form will appear here once demand starts coming in."
      }
      title="No leads yet"
    />
  );
}

export function NoResults() {
  const { setFilter } = useLeadFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
