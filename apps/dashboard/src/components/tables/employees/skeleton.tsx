import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardTablePage,
  DashboardTablePageBody,
  DashboardTablePageHeader,
} from "@/components/dashboard/dashboard-page";

export function EmployeesSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPageHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </DashboardPageHeader>

      <DashboardTablePage>
        <DashboardTablePageHeader>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="h-4 w-16" />
          </div>
        </DashboardTablePageHeader>
        <DashboardTablePageBody>
          <div className="divide-y divide-border/70 border-border md:border-x">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="flex items-center justify-between gap-4 px-3 py-4"
                key={index.toString()}
              >
                <div className="space-y-2">
                  <Skeleton className="h-3 w-44" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </DashboardTablePageBody>
      </DashboardTablePage>
    </div>
  );
}
