"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useTeamFilterParams } from "@/hooks/use-team-filter-params";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
];

export function TeamsSearchFilter() {
  const { filters, setFilters } = useTeamFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search members..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
