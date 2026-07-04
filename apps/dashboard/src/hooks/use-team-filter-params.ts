"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import { teamFilterParams, type TeamFilters } from "@/lib/team-filter-params";

const clearTeamFilters: TeamFilters = {
  q: null,
};

export function useTeamFilterParams() {
  const [filters, setFilterParams] = useQueryStates(teamFilterParams);
  const setFilters = useCallback(
    (next: Partial<TeamFilters> | null) => {
      void setFilterParams(next ?? clearTeamFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
