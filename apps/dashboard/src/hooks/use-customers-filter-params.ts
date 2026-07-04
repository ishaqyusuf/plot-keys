"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  customersFilterParams,
  type CustomersFilters,
} from "../lib/customers-filter-params";

const clearCustomersFilters: CustomersFilters = {
  filter: null,
  q: null,
};

export function useCustomersFilterParams() {
  const [filters, setFilterParams] = useQueryStates(customersFilterParams);
  const setFilters = useCallback(
    (next: Partial<CustomersFilters> | null) => {
      void setFilterParams(next ?? clearCustomersFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    isPending: false,
    setFilters,
  };
}
