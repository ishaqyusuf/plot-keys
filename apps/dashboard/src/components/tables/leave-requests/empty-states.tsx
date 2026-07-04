"use client";

import { Button } from "@plotkeys/ui/button";
import { CalendarClock, SearchX } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import {
  leaveRequestStatusConfig,
  type LeaveRequestStatus,
} from "@/components/leave-requests/leave-request-utils";

type LeaveRequestsEmptyStateProps = {
  activeStatus?: LeaveRequestStatus;
};

type LeaveRequestsNoResultsProps = {
  onClear: () => void;
};

export function LeaveRequestsEmptyState({
  activeStatus,
}: LeaveRequestsEmptyStateProps) {
  return (
    <DashboardEmptyState
      description={
        activeStatus
          ? `No ${leaveRequestStatusConfig[activeStatus].label.toLowerCase()} leave requests found.`
          : "No leave requests yet. Submit one to start the workflow."
      }
      icon={<CalendarClock className="size-5" />}
      title="No leave requests"
    />
  );
}

export function LeaveRequestsNoResults({
  onClear,
}: LeaveRequestsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">
          No leave requests found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current leave request search.
        </p>
        <Button
          className="mt-4"
          onClick={onClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}
