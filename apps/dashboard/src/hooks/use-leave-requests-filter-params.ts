"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import { isLeaveRequestStatus } from "@/components/leave-requests/leave-request-utils";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const leaveRequestsFilterParamsSchema = {
  end: parseAsString,
  q: parseAsString,
  start: parseAsString,
  status: parseAsString,
};

export const loadLeaveRequestsFilterParams = createLoader(
  leaveRequestsFilterParamsSchema,
);

export type LeaveRequestsFilters = Awaited<
  ReturnType<typeof loadLeaveRequestsFilterParams>
>;
type LeaveRequestsSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type LeaveRequestsListInputOptions = {
  q?: string | null;
};

export function resolveLeaveRequestsListInput(
  filters: LeaveRequestsFilters,
  sort: LeaveRequestsSort,
  options: LeaveRequestsListInputOptions = {},
) {
  const statusParam = filters.status ?? undefined;
  const status = isLeaveRequestStatus(statusParam) ? statusParam : undefined;

  return {
    end: filters.end,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
    status,
  };
}

const clearLeaveRequestsFilters: LeaveRequestsFilters = {
  end: null,
  q: null,
  start: null,
  status: null,
};

export function useLeaveRequestsFilterParams() {
  const [filter, setFilterParams] = useQueryStates(
    leaveRequestsFilterParamsSchema,
  );
  const setFilter = useCallback(
    (next: Partial<LeaveRequestsFilters> | null) => {
      void setFilterParams(next ?? clearLeaveRequestsFilters);
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
