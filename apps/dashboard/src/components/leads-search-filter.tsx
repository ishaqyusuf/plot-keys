"use client";

import { leadStatusConfig, leadStatuses } from "@/components/leads/lead-utils";
import { SearchFilter } from "@/components/search-filter/search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useLeadFilterParams } from "@/hooks/use-lead-filter-params";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
  {
    label: "Status",
    options: leadStatuses.map((status) => ({
      label: leadStatusConfig[status].label,
      value: status,
    })),
    type: "select",
    value: "status",
  },
  {
    label: "Captured date",
    type: "date-range",
    value: "start",
  },
];

export function LeadsSearchFilter() {
  const { filter, setFilter } = useLeadFilterParams();

  return (
    <SearchFilter
      filterList={filterList}
      filters={filter}
      placeholder="Search leads..."
      setFilters={(next) => setFilter(next as Parameters<typeof setFilter>[0])}
    />
  );
}
