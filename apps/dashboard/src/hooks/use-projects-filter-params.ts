"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  projectsFilterParams,
  type ProjectsFilters,
} from "@/lib/projects-filter-params";

const clearProjectsFilters: ProjectsFilters = {
  q: null,
  status: null,
};

export function useProjectsFilterParams() {
  const [filters, setFilterParams] = useQueryStates(projectsFilterParams);
  const setFilters = useCallback(
    (next: Partial<ProjectsFilters> | null) => {
      void setFilterParams(next ?? clearProjectsFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
