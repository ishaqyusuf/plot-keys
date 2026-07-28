"use client";

import {
  employeeStatusConfig,
  employeeStatuses,
} from "@/components/employees/employee-utils";
import { SearchFilter } from "@/components/search-filter/search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useEmployeesFilterParams } from "@/hooks/use-employees-filter-params";

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
  {
    label: "Start date",
    type: "date-range",
    value: "start",
  },
];

export function EmployeesSearchFilter() {
  const { filters, setFilters } = useEmployeesFilterParams();

  return (
    <SearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search employees..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
