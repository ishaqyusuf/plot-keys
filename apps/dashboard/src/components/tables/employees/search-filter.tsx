"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useEmployeesFilterParams } from "@/hooks/use-employees-filter-params";
import { employeeStatusConfig, employeeStatuses } from "@/components/employees/employee-utils";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
  {
    label: "Status",
    options: employeeStatuses.map((status) => ({
      label: employeeStatusConfig[status].label,
      value: status,
    })),
    type: "select",
    value: "status",
  },
];

export function EmployeesSearchFilter() {
  const { filters, setFilters } = useEmployeesFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search employees..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
