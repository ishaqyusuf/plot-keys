"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const teamFilterParamsSchema = {
  end: parseAsString,
  q: parseAsString,
  start: parseAsString,
};

export const loadTeamFilterParams = createLoader(teamFilterParamsSchema);

export type TeamFilters = Awaited<ReturnType<typeof loadTeamFilterParams>>;
type TeamSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type TeamListInputOptions = {
  q?: string | null;
};

export function resolveTeamListInput(
  filters: TeamFilters,
  sort: TeamSort,
  options: TeamListInputOptions = {},
) {
  return {
    end: filters.end,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
  };
}

const clearTeamFilters: TeamFilters = {
  end: null,
  q: null,
  start: null,
};

export function useTeamFilterParams() {
  const [filter, setFilterParams] = useQueryStates(teamFilterParamsSchema);
  const setFilter = useCallback(
    (next: Partial<TeamFilters> | null) => {
      void setFilterParams(next ?? clearTeamFilters);
    },
    [setFilterParams],
  );

  return {
    filter,
    filters: filter,
    setFilter,
    setFilters: setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}
