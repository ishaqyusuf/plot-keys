"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const agentFilterParamsSchema = {
  q: parseAsString,
};

export const loadAgentFilterParams = createLoader(agentFilterParamsSchema);

export type AgentFilters = Awaited<ReturnType<typeof loadAgentFilterParams>>;
type AgentSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type AgentListInputOptions = {
  q?: string | null;
};

export function resolveAgentListInput(
  filters: AgentFilters,
  sort: AgentSort,
  options: AgentListInputOptions = {},
) {
  return { q: options.q ?? filters.q, sort };
}

const clearAgentFilters: AgentFilters = {
  q: null,
};

export function useAgentFilterParams() {
  const [filter, setFilterParams] = useQueryStates(agentFilterParamsSchema);
  const setFilter = useCallback(
    (next: Partial<AgentFilters> | null) => {
      void setFilterParams(next ?? clearAgentFilters);
    },
    [setFilterParams],
  );

  return {
    filter,
    setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}
