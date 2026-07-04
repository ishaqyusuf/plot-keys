"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  leaveRequestsFilterParams,
  type LeaveRequestsFilters,
} from "@/lib/leave-requests-filter-params";

const clearLeaveRequestsFilters: LeaveRequestsFilters = {
  q: null,
  status: null,
};

export function useLeaveRequestsFilterParams() {
  const [filters, setFilterParams] = useQueryStates(leaveRequestsFilterParams);
  const setFilters = useCallback(
    (next: Partial<LeaveRequestsFilters> | null) => {
      void setFilterParams(next ?? clearLeaveRequestsFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
