"use client";

import { DashboardSearchFilter } from "../../../components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "../../../components/search-filter/types";
import { usePropertiesFilterParams } from "../../../hooks/use-properties-filter-params";

type PropertiesSearchFilterProps = {
  filterList: PageFilterData[];
};

export function PropertiesSearchFilter({ filterList }: PropertiesSearchFilterProps) {
  const { filters, setFilters } = usePropertiesFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search listings..."
      setFilters={setFilters}
    />
  );
}
