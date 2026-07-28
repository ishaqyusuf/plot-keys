import { LeaveRequestsColumnVisibility } from "@/components/leave-requests-column-visibility";
import { LeaveRequestsSearchFilter } from "@/components/leave-requests-search-filter";
import { LeaveRequestsStatusTabs } from "@/components/leave-requests-status-tabs";
import { OpenLeaveRequestSheet } from "@/components/open-leave-request-sheet";

export function LeaveRequestsHeader() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <LeaveRequestsSearchFilter />

        <div className="flex items-center gap-2">
          <LeaveRequestsColumnVisibility />
          <div className="hidden sm:block">
            <OpenLeaveRequestSheet />
          </div>
        </div>
      </div>

      <LeaveRequestsStatusTabs />
    </div>
  );
}
