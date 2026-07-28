"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import {
  isLeaveRequestStatus,
  leaveRequestStatusConfig,
  leaveRequestStatuses,
} from "@/components/leave-requests/leave-request-utils";
import { useLeaveRequestsFilterParams } from "@/hooks/use-leave-requests-filter-params";
import { useTRPC } from "@/trpc/client";

export function LeaveRequestsStatusTabs() {
  const trpc = useTRPC();
  const { filter } = useLeaveRequestsFilterParams();
  const { data: stats } = useSuspenseQuery(
    trpc.leaveRequests.stats.queryOptions(),
  );
  const activeStatus = isLeaveRequestStatus(filter.status ?? undefined)
    ? filter.status
    : undefined;

  return (
    <HeaderLinkTabList>
      <HeaderLinkTab active={!activeStatus} href="/hr/leave">
        All ({stats.total})
      </HeaderLinkTab>
      {leaveRequestStatuses.map((status) => (
        <HeaderLinkTab
          active={activeStatus === status}
          href={`/hr/leave?status=${status}`}
          key={status}
        >
          {leaveRequestStatusConfig[status].label} ({stats[status] ?? 0})
        </HeaderLinkTab>
      ))}
    </HeaderLinkTabList>
  );
}
