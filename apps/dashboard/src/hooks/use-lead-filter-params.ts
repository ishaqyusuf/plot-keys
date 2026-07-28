"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { isLeadStatus } from "@/components/leads/lead-utils";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const leadFilterParamsSchema = {
  end: parseAsString,
  q: parseAsString,
  start: parseAsString,
  status: parseAsString,
};

export function useLeadFilterParams() {
  const [filter, setFilter] = useQueryStates(leadFilterParamsSchema);

  return {
    filter,
    setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}

export const loadLeadFilterParams = createLoader(leadFilterParamsSchema);

export type LeadFilters = Awaited<ReturnType<typeof loadLeadFilterParams>>;
type LeadSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type LeadListInputOptions = {
  q?: string | null;
};

export function resolveLeadListInput(
  filters: LeadFilters,
  sort: LeadSort,
  options: LeadListInputOptions = {},
) {
  const statusParam = filters.status ?? undefined;
  const status = isLeadStatus(statusParam) ? statusParam : undefined;

  return {
    end: filters.end,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
    status,
  };
}
