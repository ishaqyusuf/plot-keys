"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useLeaveRequestsFilterParams } from "@/hooks/use-leave-requests-filter-params";
import {
  leaveRequestStatusConfig,
  leaveRequestStatuses,
} from "@/components/leave-requests/leave-request-utils";

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
];

export function LeaveRequestsSearchFilter() {
  const { filters, setFilters } = useLeaveRequestsFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search leave requests..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
