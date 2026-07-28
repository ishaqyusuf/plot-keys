"use client";

import {
  blogPostStatusConfig,
  blogPostStatuses,
} from "@/components/blog/blog-utils";
import { SearchFilter } from "@/components/search-filter/search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useBlogFilterParams } from "@/hooks/use-blog-filter-params";

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
  {
    label: "Published date",
    type: "date-range",
    value: "start",
  },
];

export function BlogSearchFilter() {
  const { filters, setFilters } = useBlogFilterParams();

  return (
    <SearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search posts..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
