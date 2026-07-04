"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  employeesFilterParams,
  type EmployeesFilters,
} from "@/lib/employees-filter-params";

const clearEmployeesFilters: EmployeesFilters = {
  department: null,
  q: null,
  status: null,
};

export function useEmployeesFilterParams() {
  const [filters, setFilterParams] = useQueryStates(employeesFilterParams);
  const setFilters = useCallback(
    (next: Partial<EmployeesFilters> | null) => {
      void setFilterParams(next ?? clearEmployeesFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
