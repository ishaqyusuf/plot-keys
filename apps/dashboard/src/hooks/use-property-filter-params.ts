"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import type { loadSortParams } from "@/hooks/use-sort-params";

const propertyFilterParamsSchema = {
  q: parseAsString,
  type: parseAsString,
};

export function usePropertyFilterParams() {
  const [filter, setFilter] = useQueryStates(propertyFilterParamsSchema);

  return {
    filter,
    setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}

export const loadPropertyFilterParams = createLoader(
  propertyFilterParamsSchema,
);

export type PropertyFilters = Awaited<
  ReturnType<typeof loadPropertyFilterParams>
>;
type PropertySort = Awaited<ReturnType<typeof loadSortParams>>["sort"];

type PropertyListInputOptions = {
  q?: string | null;
};

export function resolvePropertyListInput(
  filters: PropertyFilters,
  sort: PropertySort,
  options: PropertyListInputOptions = {},
) {
  return {
    ...filters,
    q: options.q ?? filters.q,
    sort,
  };
}
