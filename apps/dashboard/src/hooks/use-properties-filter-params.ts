"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  propertiesFilterParams,
  type PropertiesFilters,
} from "../lib/properties-filter-params";

const clearPropertiesFilters: PropertiesFilters = {
  q: null,
  type: null,
};

export function usePropertiesFilterParams() {
  const [filters, setFilterParams] = useQueryStates(propertiesFilterParams);
  const setFilters = useCallback(
    (next: Partial<PropertiesFilters> | null) => {
      void setFilterParams(next ?? clearPropertiesFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
