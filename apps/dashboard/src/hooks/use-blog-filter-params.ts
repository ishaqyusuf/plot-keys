"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import { isBlogPostStatus } from "@/components/blog/blog-utils";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const blogFilterParamsSchema = {
  end: parseAsString,
  q: parseAsString,
  start: parseAsString,
  status: parseAsString,
};

export const loadBlogFilterParams = createLoader(blogFilterParamsSchema);

export type BlogFilters = Awaited<ReturnType<typeof loadBlogFilterParams>>;
type BlogSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type BlogListInputOptions = {
  q?: string | null;
};

export function resolveBlogListInput(
  filters: BlogFilters,
  sort: BlogSort,
  options: BlogListInputOptions = {},
) {
  const statusParam = filters.status ?? undefined;
  const status = isBlogPostStatus(statusParam) ? statusParam : undefined;

  return {
    end: filters.end,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
    status,
  };
}

const clearBlogFilters: BlogFilters = {
  end: null,
  q: null,
  start: null,
  status: null,
};

export function useBlogFilterParams() {
  const [filter, setFilterParams] = useQueryStates(blogFilterParamsSchema);
  const setFilter = useCallback(
    (next: Partial<BlogFilters> | null) => {
      void setFilterParams(next ?? clearBlogFilters);
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
