"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { usePropertiesFilterParams } from "@/hooks/use-properties-filter-params";
import { useTRPC } from "@/trpc/client";

export function PropertiesSearchFilter() {
  const trpc = useTRPC();
  const { filters, setFilters } = usePropertiesFilterParams();
  const { data: filterList } = useSuspenseQuery(
    trpc.filters.properties.queryOptions(),
  );

  return (
    <DashboardSearchFilter
      filterList={filterList as PageFilterData[]}
      filters={filters}
      placeholder="Search listings..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
