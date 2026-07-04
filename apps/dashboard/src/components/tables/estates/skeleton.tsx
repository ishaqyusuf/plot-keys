import { Skeleton } from "@plotkeys/ui/skeleton";

import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

export function EstatesSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-[1.25rem] border border-border/70 bg-card/82 p-5"
            key={index.toString()}
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-8 w-16" />
          </div>
        ))}
      </DashboardStatGrid>

      <DashboardSection>
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-96 max-w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="rounded-[1.25rem] border border-border/70 bg-card/82 p-5"
              key={index.toString()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="mt-5 h-16 w-full" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
