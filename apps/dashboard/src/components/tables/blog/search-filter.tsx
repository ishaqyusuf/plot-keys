"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useBlogFilterParams } from "@/hooks/use-blog-filter-params";
import { blogPostStatusConfig, blogPostStatuses } from "@/components/blog/blog-utils";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
  {
    label: "Status",
    options: blogPostStatuses.map((status) => ({
      label: blogPostStatusConfig[status].label,
      value: status,
    })),
    type: "select",
    value: "status",
  },
];

export function BlogSearchFilter() {
  const { filters, setFilters } = useBlogFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search posts..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
