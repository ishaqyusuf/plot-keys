"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { usePayrollFilterParams } from "@/hooks/use-payroll-filter-params";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
];

export function PayrollSearchFilter() {
  const { filters, setFilters } = usePayrollFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search payroll..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
