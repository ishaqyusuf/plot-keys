"use client";

import { DashboardSearchFilter } from "../../../components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "../../../components/search-filter/types";
import { useCustomersFilterParams } from "../../../hooks/use-customers-filter-params";

type CustomersSearchFilterProps = {
  filterList: PageFilterData[];
};

export function CustomersSearchFilter({
  filterList,
}: CustomersSearchFilterProps) {
  const { filters, setFilters } = useCustomersFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search name, email, or phone"
      setFilters={setFilters}
    />
  );
}
