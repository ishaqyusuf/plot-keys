import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardSectionHeader,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

export function EstateDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
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

      {Array.from({ length: 4 }).map((_, index) => (
        <DashboardSection key={index.toString()}>
          <DashboardSectionHeader>
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          </DashboardSectionHeader>
          <div className="rounded-[1.25rem] border border-border/70 bg-card/82 p-5">
            <Skeleton className="h-48 w-full" />
          </div>
        </DashboardSection>
      ))}
    </div>
  );
}
