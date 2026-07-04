import { Skeleton } from "@plotkeys/ui/skeleton";

import {
  DashboardPageHeader,
  DashboardSection,
} from "@/components/dashboard/dashboard-page";

export function TemplateSandboxSkeleton() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </DashboardPageHeader>

      <div className="grid gap-4 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="rounded-[1.25rem] border border-border/65 bg-card/78 p-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-full max-w-xs" />
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-10 w-full" key={index.toString()} />
            ))}
          </div>
        </div>

        <DashboardSection className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3 w-80 max-w-full" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="rounded-[1.25rem] border border-border/65 bg-card/78 p-4"
                key={index.toString()}
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-full max-w-lg" />
                    <Skeleton className="h-3 w-full max-w-md" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
