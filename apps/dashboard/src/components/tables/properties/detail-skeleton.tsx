import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardSectionHeader,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

export function PropertyDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </DashboardPageHeader>

      <DashboardStatGrid className="xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="rounded-[1.25rem] border border-border/70 bg-card/82 px-5 py-5"
            key={index.toString()}
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-14" />
          </div>
        ))}
      </DashboardStatGrid>

      {Array.from({ length: 2 }).map((_, index) => (
        <DashboardSection key={index.toString()}>
          <DashboardSectionHeader>
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          </DashboardSectionHeader>
          <div className="rounded-[1.25rem] border border-border/70 bg-card/82 p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </DashboardSection>
      ))}
    </div>
  );
}
