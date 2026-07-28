"use client";

import {
  leaveRequestStatusConfig,
  leaveRequestStatuses,
} from "@/components/leave-requests/leave-request-utils";
import { SearchFilter } from "@/components/search-filter/search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useLeaveRequestsFilterParams } from "@/hooks/use-leave-requests-filter-params";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
  {
    label: "Status",
    options: leaveRequestStatuses.map((status) => ({
      label: leaveRequestStatusConfig[status].label,
      value: status,
    })),
    type: "select",
    value: "status",
  },
  {
    label: "Leave date",
    type: "date-range",
    value: "start",
  },
];

export function LeaveRequestsSearchFilter() {
  const { filters, setFilters } = useLeaveRequestsFilterParams();

  return (
    <SearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search leave requests..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
