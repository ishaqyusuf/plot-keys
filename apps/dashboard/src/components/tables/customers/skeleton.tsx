import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardTablePage,
  DashboardTablePageBody,
  DashboardTablePageHeader,
} from "@/components/dashboard/dashboard-page";
import { CustomersSearchFilterSkeleton } from "./search-filter-skeleton";

const SUMMARY_SKELETON_IDS = ["total", "active", "vip", "inactive"] as const;
const TABLE_ROW_SKELETON_IDS = [
  "row-1",
  "row-2",
  "row-3",
  "row-4",
  "row-5",
  "row-6",
  "row-7",
  "row-8",
] as const;
const TABLE_CELL_SKELETON_IDS = [
  "customer",
  "contact",
  "status",
  "created",
  "notes",
  "actions",
] as const;

export function CustomersSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_SKELETON_IDS.map((id) => (
          <Skeleton key={id} className="h-32 rounded-[1.25rem]" />
        ))}
      </div>

      <DashboardTablePage>
        <DashboardTablePageHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-5 w-96 max-w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-44" />
            </div>
            <CustomersSearchFilterSkeleton />
          </div>
        </DashboardTablePageHeader>
        <DashboardTablePageBody>
          <div className="space-y-0">
            {TABLE_ROW_SKELETON_IDS.map((rowId) => (
              <div
                key={rowId}
                className="grid grid-cols-[1.5fr_1.3fr_0.7fr_0.7fr_1.2fr_1fr] gap-4 border-b border-border/50 px-5 py-4"
              >
                {TABLE_CELL_SKELETON_IDS.map((cellId) => (
                  <Skeleton key={`${rowId}-${cellId}`} className="h-5 w-full" />
                ))}
              </div>
            ))}
          </div>
        </DashboardTablePageBody>
      </DashboardTablePage>
    </div>
  );
}
