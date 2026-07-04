import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
} from "@/components/dashboard/dashboard-page";

export function DomainsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-4 w-36" />
      </DashboardPageHeader>

      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <DashboardSection key={sectionIndex.toString()}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
          <div className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-7 w-24" />
            </div>
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <Skeleton
                  className="h-12 w-full"
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
