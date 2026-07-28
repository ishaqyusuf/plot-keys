"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import { isEmployeeStatus } from "@/components/employees/employee-utils";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const employeesFilterParamsSchema = {
  department: parseAsString,
  end: parseAsString,
  q: parseAsString,
  start: parseAsString,
  status: parseAsString,
};

export const loadEmployeesFilterParams = createLoader(
  employeesFilterParamsSchema,
);

export type EmployeesFilters = Awaited<
  ReturnType<typeof loadEmployeesFilterParams>
>;
type EmployeesSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type EmployeesListInputOptions = {
  q?: string | null;
};

export function resolveEmployeesListInput(
  filters: EmployeesFilters,
  sort: EmployeesSort,
  options: EmployeesListInputOptions = {},
) {
  const statusParam = filters.status ?? undefined;
  const status = isEmployeeStatus(statusParam) ? statusParam : undefined;
  const departmentId = filters.department?.trim() || undefined;

  return {
    departmentId,
    end: filters.end,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
    status,
  };
}

const clearEmployeesFilters: EmployeesFilters = {
  department: null,
  end: null,
  q: null,
  start: null,
  status: null,
};

export function useEmployeesFilterParams() {
  const [filter, setFilterParams] = useQueryStates(employeesFilterParamsSchema);
  const setFilters = useCallback(
    (next: Partial<EmployeesFilters> | null) => {
      void setFilterParams(next ?? clearEmployeesFilters);
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
