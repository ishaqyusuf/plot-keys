"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const payrollFilterParamsSchema = {
  q: parseAsString,
};

export const loadPayrollFilterParams = createLoader(payrollFilterParamsSchema);

export type PayrollFilters = Awaited<
  ReturnType<typeof loadPayrollFilterParams>
>;
type PayrollSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type PayrollPeriodInput = {
  periodMonth: number;
  periodYear: number;
};
type PayrollListInputOptions = {
  q?: string | null;
};

export function resolvePayrollListInput(
  filters: PayrollFilters,
  sort: PayrollSort,
  periodInput: PayrollPeriodInput,
  options: PayrollListInputOptions = {},
) {
  return { ...periodInput, q: options.q ?? filters.q, sort };
}

const clearPayrollFilters: PayrollFilters = {
  q: null,
};

export function usePayrollFilterParams() {
  const [filter, setFilterParams] = useQueryStates(payrollFilterParamsSchema);
  const setFilter = useCallback(
    (next: Partial<PayrollFilters> | null) => {
      void setFilterParams(next ?? clearPayrollFilters);
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
