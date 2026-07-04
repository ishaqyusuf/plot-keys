"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  agentsFilterParams,
  type AgentsFilters,
} from "@/lib/agents-filter-params";

const clearAgentsFilters: AgentsFilters = {
  q: null,
};

export function useAgentsFilterParams() {
  const [filters, setFilterParams] = useQueryStates(agentsFilterParams);
  const setFilters = useCallback(
    (next: Partial<AgentsFilters> | null) => {
      void setFilterParams(next ?? clearAgentsFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
