import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

export function DashboardHomeSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPageHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </DashboardPageHeader>

      <DashboardStatGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-[1.25rem] border border-border/65 bg-card/78 p-4"
            key={index.toString()}
          >
            <Skeleton className="size-10 rounded-[1rem]" />
            <Skeleton className="mt-5 h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-12" />
          </div>
        ))}
      </DashboardStatGrid>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <DashboardSection key={index.toString()}>
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-72 max-w-full" />
            </div>
            <div className="rounded-[1.25rem] border border-border/65 bg-card/78 p-5">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="mt-5 h-14 w-full" />
              <Skeleton className="mt-4 h-9 w-36" />
            </div>
          </DashboardSection>
        ))}
      </div>
    </div>
  );
}
