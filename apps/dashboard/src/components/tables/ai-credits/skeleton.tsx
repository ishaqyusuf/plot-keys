import { Skeleton } from "@plotkeys/ui/skeleton";

import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

export function AiCreditsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="rounded-[1.25rem] border border-border/70 bg-card/82 p-5"
            key={index.toString()}
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        ))}
      </DashboardStatGrid>

      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <DashboardSection key={sectionIndex.toString()}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-96 max-w-full" />
          </div>
          <div className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5">
            <div className="space-y-3">
              {Array.from({ length: sectionIndex === 0 ? 2 : 5 }).map(
                (_, rowIndex) => (
                  <Skeleton
                    className="h-12 w-full"
                    key={`${sectionIndex}-${rowIndex}`}
                  />
                ),
              )}
            </div>
          </div>
        </DashboardSection>
      ))}
    </div>
  );
}
