"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useCustomersFilterParams } from "@/hooks/use-customers-filter-params";
import { useTRPC } from "@/trpc/client";

export function CustomersSearchFilter() {
  const trpc = useTRPC();
  const { filters, setFilters } = useCustomersFilterParams();
  const { data: filterList } = useSuspenseQuery(
    trpc.filters.customers.queryOptions(),
  );

  return (
    <DashboardSearchFilter
      filterList={filterList as PageFilterData[]}
      filters={filters}
      placeholder="Search name, email, or phone"
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
