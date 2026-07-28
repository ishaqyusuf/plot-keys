"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const departmentsFilterParamsSchema = {
  q: parseAsString,
};

export const loadDepartmentsFilterParams = createLoader(
  departmentsFilterParamsSchema,
);

export type DepartmentsFilters = Awaited<
  ReturnType<typeof loadDepartmentsFilterParams>
>;
type DepartmentsSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type DepartmentsListInputOptions = {
  q?: string | null;
};

export function resolveDepartmentsListInput(
  filters: DepartmentsFilters,
  sort: DepartmentsSort,
  options: DepartmentsListInputOptions = {},
) {
  return { q: options.q ?? filters.q, sort };
}

const clearDepartmentsFilters: DepartmentsFilters = {
  q: null,
};

export function useDepartmentsFilterParams() {
  const [filter, setFilterParams] = useQueryStates(
    departmentsFilterParamsSchema,
  );
  const setFilter = useCallback(
    (next: Partial<DepartmentsFilters> | null) => {
      void setFilterParams(next ?? clearDepartmentsFilters);
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
