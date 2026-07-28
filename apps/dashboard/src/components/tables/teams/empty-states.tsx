"use client";

import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useTeamFilterParams } from "@/hooks/use-team-filter-params";

export function EmptyState() {
  return (
    <CoreEmptyState
      description="Invite a colleague to collaborate on this workspace."
      title="No team members yet"
    />
  );
}

export function NoResults() {
  const { setFilter } = useTeamFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
