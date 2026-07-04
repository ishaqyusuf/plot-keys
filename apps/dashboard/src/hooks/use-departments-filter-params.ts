"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  departmentsFilterParams,
  type DepartmentsFilters,
} from "@/lib/departments-filter-params";

const clearDepartmentsFilters: DepartmentsFilters = {
  q: null,
};

export function useDepartmentsFilterParams() {
  const [filters, setFilterParams] = useQueryStates(departmentsFilterParams);
  const setFilters = useCallback(
    (next: Partial<DepartmentsFilters> | null) => {
      void setFilterParams(next ?? clearDepartmentsFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
