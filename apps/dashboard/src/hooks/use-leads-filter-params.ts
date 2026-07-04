"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  leadsFilterParams,
  type LeadsFilters,
} from "@/lib/leads-filter-params";

const clearLeadsFilters: LeadsFilters = {
  q: null,
  status: null,
};

export function useLeadsFilterParams() {
  const [filters, setFilterParams] = useQueryStates(leadsFilterParams);
  const setFilters = useCallback(
    (next: Partial<LeadsFilters> | null) => {
      void setFilterParams(next ?? clearLeadsFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
