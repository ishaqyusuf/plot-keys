"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  payrollFilterParams,
  type PayrollFilters,
} from "@/lib/payroll-filter-params";

const clearPayrollFilters: PayrollFilters = {
  q: null,
};

export function usePayrollFilterParams() {
  const [filters, setFilterParams] = useQueryStates(payrollFilterParams);
  const setFilters = useCallback(
    (next: Partial<PayrollFilters> | null) => {
      void setFilterParams(next ?? clearPayrollFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
