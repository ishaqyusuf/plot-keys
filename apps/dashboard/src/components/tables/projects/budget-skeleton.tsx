import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardSectionHeader,
  DashboardTablePage,
  DashboardTablePageBody,
  DashboardTablePageHeader,
} from "@/components/dashboard/dashboard-page";

export function ProjectBudgetSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
        </DashboardSectionHeader>
        <div className="rounded-[1.25rem] border border-border/70 bg-card/82 p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="h-20 rounded-lg" key={index.toString()} />
            ))}
          </div>
        </div>
      </DashboardSection>

      <DashboardTablePage>
        <DashboardTablePageHeader>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </DashboardTablePageHeader>
        <DashboardTablePageBody>
          <div className="divide-y divide-border/70 border-border md:border-x">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="grid gap-4 px-3 py-4 md:grid-cols-[1fr_9rem_7rem_7rem]"
                key={index.toString()}
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-72 max-w-full" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20 justify-self-end" />
                <Skeleton className="h-8 w-24 justify-self-end" />
              </div>
            ))}
          </div>
        </DashboardTablePageBody>
      </DashboardTablePage>
    </div>
  );
}
