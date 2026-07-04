import { Skeleton } from "@plotkeys/ui/skeleton";

import {
  DashboardPageHeader,
  DashboardSection,
} from "@/components/dashboard/dashboard-page";

export function IntegrationSettingsSkeleton() {
  return (
    <>
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </DashboardPageHeader>

      <DashboardSection>
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-96 max-w-full" />
        </div>
        <div className="grid gap-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5"
              key={index.toString()}
            >
              <div className="flex items-start gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </>
  );
}
