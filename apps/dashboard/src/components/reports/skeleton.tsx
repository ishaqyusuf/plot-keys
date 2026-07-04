import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
} from "@/components/dashboard/dashboard-page";

export function ReportsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              className="h-7 w-24 rounded-full"
              key={index.toString()}
            />
          ))}
        </div>
      </DashboardPageHeader>

      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <DashboardSection key={sectionIndex.toString()}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
          <div className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="mt-5 space-y-3">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <Skeleton
                  className="h-10 w-full"
                  key={`${sectionIndex}-${rowIndex}`}
                />
              ))}
            </div>
          </div>
        </DashboardSection>
      ))}
    </div>
  );
}
