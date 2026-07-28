"use client";

import {
  type LeaveRequestStatus,
  leaveRequestStatusConfig,
} from "@/components/leave-requests/leave-request-utils";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useLeaveRequestsFilterParams } from "@/hooks/use-leave-requests-filter-params";

type Props = {
  activeStatus?: LeaveRequestStatus;
};

export function EmptyState({ activeStatus }: Props) {
  return (
    <CoreEmptyState
      description={
        activeStatus
          ? `No ${leaveRequestStatusConfig[activeStatus].label.toLowerCase()} leave requests found.`
          : "No leave requests yet. Submit one to start the workflow."
      }
      title="No leave requests"
    />
  );
}

export function NoResults() {
  const { setFilter } = useLeaveRequestsFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
