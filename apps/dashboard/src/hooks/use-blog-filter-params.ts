"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  blogFilterParams,
  type BlogFilters,
} from "@/lib/blog-filter-params";

const clearBlogFilters: BlogFilters = {
  q: null,
  status: null,
};

export function useBlogFilterParams() {
  const [filters, setFilterParams] = useQueryStates(blogFilterParams);
  const setFilters = useCallback(
    (next: Partial<BlogFilters> | null) => {
      void setFilterParams(next ?? clearBlogFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
