"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  appointmentsFilterParams,
  type AppointmentsFilters,
} from "@/lib/appointments-filter-params";

const clearAppointmentsFilters: AppointmentsFilters = {
  q: null,
  status: null,
  view: null,
};

export function useAppointmentsFilterParams() {
  const [filters, setFilterParams] = useQueryStates(appointmentsFilterParams);
  const setFilters = useCallback(
    (next: Partial<AppointmentsFilters> | null) => {
      void setFilterParams(next ?? clearAppointmentsFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
