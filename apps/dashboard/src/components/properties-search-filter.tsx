"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SearchFilter } from "@/components/search-filter/search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { usePropertyFilterParams } from "@/hooks/use-property-filter-params";
import { useTRPC } from "@/trpc/client";

export function PropertiesSearchFilter() {
  const trpc = useTRPC();
  const { filter, setFilter } = usePropertyFilterParams();
  const { data: filterList } = useSuspenseQuery(
    trpc.filters.properties.queryOptions(),
  );

  return (
    <SearchFilter
      filterList={filterList as PageFilterData[]}
      filters={filter}
      placeholder="Search listings..."
      setFilters={(next) => setFilter(next as Parameters<typeof setFilter>[0])}
    />
  );
}
