import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

export function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
      </DashboardPageHeader>

      <DashboardStatGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-[1.25rem] border border-border/65 bg-card/78 px-5 py-5"
            key={index.toString()}
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
          </div>
        ))}
      </DashboardStatGrid>

      <DashboardSection>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5"
              key={index.toString()}
            >
              <Skeleton className="h-4 w-36" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <Skeleton
                    className="h-10 w-full"
                    key={`${index}-${rowIndex}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
