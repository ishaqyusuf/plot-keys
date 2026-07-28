"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import { isProjectStatus } from "@/components/projects/project-utils";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const projectsFilterParamsSchema = {
  end: parseAsString,
  q: parseAsString,
  start: parseAsString,
  status: parseAsString,
};

export const loadProjectsFilterParams = createLoader(
  projectsFilterParamsSchema,
);

export type ProjectsFilters = Awaited<
  ReturnType<typeof loadProjectsFilterParams>
>;
type ProjectsSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type ProjectsListInputOptions = {
  q?: string | null;
};

export function resolveProjectsListInput(
  filters: ProjectsFilters,
  sort: ProjectsSort,
  options: ProjectsListInputOptions = {},
) {
  const statusParam = filters.status ?? undefined;
  const status = isProjectStatus(statusParam) ? statusParam : undefined;

  return {
    end: filters.end,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
    status,
  };
}

const clearProjectsFilters: ProjectsFilters = {
  end: null,
  q: null,
  start: null,
  status: null,
};

export function useProjectsFilterParams() {
  const [filter, setFilterParams] = useQueryStates(projectsFilterParamsSchema);
  const setFilters = useCallback(
    (next: Partial<ProjectsFilters> | null) => {
      void setFilterParams(next ?? clearProjectsFilters);
    },
    [setFilterParams],
  );

  return {
    filter,
    filters: filter,
    setFilter: setFilters,
    setFilters,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}
