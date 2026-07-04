import { Skeleton } from "@plotkeys/ui/skeleton";

import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

export function NotificationPreferencesSkeleton() {
  return (
    <>
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5"
            key={index.toString()}
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </div>
        ))}
      </DashboardStatGrid>

      <DashboardSection>
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-96 max-w-full" />
        </div>
        <div className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-20 w-full" key={index.toString()} />
            ))}
          </div>
        </div>
      </DashboardSection>
    </>
  );
}
