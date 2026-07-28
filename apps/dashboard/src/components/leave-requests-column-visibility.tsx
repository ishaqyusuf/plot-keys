"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useLeaveRequestsStore } from "@/store/leave-requests";

export function LeaveRequestsColumnVisibility() {
  const { columns } = useLeaveRequestsStore();

  return <CoreColumnVisibility columns={columns} />;
}
