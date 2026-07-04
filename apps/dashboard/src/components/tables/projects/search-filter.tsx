"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useProjectsFilterParams } from "@/hooks/use-projects-filter-params";
import { projectStatusConfig, projectStatuses } from "@/components/projects/project-utils";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
  {
    label: "Status",
    options: projectStatuses.map((status) => ({
      label: projectStatusConfig[status].label,
      value: status,
    })),
    type: "select",
    value: "status",
  },
];

export function ProjectsSearchFilter() {
  const { filters, setFilters } = useProjectsFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search projects..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
