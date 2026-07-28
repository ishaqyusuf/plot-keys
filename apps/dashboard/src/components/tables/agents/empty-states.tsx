"use client";

import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useAgentFilterParams } from "@/hooks/use-agent-filter-params";

export function EmptyState() {
  return (
    <CoreEmptyState
      description="Invite your first agent and they will complete their profile themselves."
      title="No agents yet"
    />
  );
}

export function NoResults() {
  const { setFilter } = useAgentFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
