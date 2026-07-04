"use client";

import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardTableFilters,
  DashboardTableHeaderTop,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";
import { LeaveRequestsColumnVisibility } from "@/components/leave-requests-column-visibility";
import { LeaveRequestSheet } from "@/components/sheets/leave-request-sheet";
import { LeaveRequestsSearchFilter } from "./search-filter";
import {
  leaveRequestStatuses,
  leaveRequestStatusConfig,
  type LeaveRequestStatus,
} from "@/components/leave-requests/leave-request-utils";

type LeaveRequestStats = Record<LeaveRequestStatus | "total", number>;

type LeaveRequestsPageHeaderProps = {
  activeStatus?: LeaveRequestStatus;
  stats: LeaveRequestStats;
};

type LeaveRequestsTableHeaderProps = {
  requestCount: number;
};

export function LeaveRequestsPageHeader({
  activeStatus,
  stats,
}: LeaveRequestsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Leave Requests</DashboardPageTitle>
          <DashboardPageDescription>
            Track time away, review approvals, and keep leave operations tied
            to the employee roster.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <LeaveRequestSheet />
          <Button asChild size="sm" variant="outline">
            <Link href="/hr/employees">Back to employees</Link>
          </Button>
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {stats.total} request{stats.total !== 1 ? "s" : ""} total
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab active={!activeStatus} href="/hr/leave">
              All ({stats.total})
            </DashboardFilterTab>
            {leaveRequestStatuses.map((status) => (
              <DashboardFilterTab
                active={activeStatus === status}
                href={`/hr/leave?status=${status}`}
                key={status}
              >
                {leaveRequestStatusConfig[status].label} (
                {stats[status] ?? 0})
              </DashboardFilterTab>
            ))}
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function LeaveRequestsTableHeader({
  requestCount,
}: LeaveRequestsTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Request queue</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Review leave windows, reasons, and approval actions in a single
            queue.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <LeaveRequestsColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <LeaveRequestsSearchFilter />
        <span className="text-sm text-muted-foreground">
          {requestCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
