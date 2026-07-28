"use client";

import {
  projectStatusConfig,
  projectStatuses,
} from "@/components/projects/project-utils";
import { SearchFilter } from "@/components/search-filter/search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useProjectsFilterParams } from "@/hooks/use-projects-filter-params";

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
  {
    label: "Timeline",
    type: "date-range",
    value: "start",
  },
];

export function ProjectsSearchFilter() {
  const { filters, setFilters } = useProjectsFilterParams();

  return (
    <SearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search projects..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
