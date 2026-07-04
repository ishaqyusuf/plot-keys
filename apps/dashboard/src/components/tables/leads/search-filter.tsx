"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useLeadsFilterParams } from "@/hooks/use-leads-filter-params";
import { leadStatusConfig, leadStatuses } from "@/components/leads/lead-utils";

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
];

export function LeadsSearchFilter() {
  const { filters, setFilters } = useLeadsFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search leads..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
