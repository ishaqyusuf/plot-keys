import { Skeleton } from "@plotkeys/ui/skeleton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardSectionHeader,
  DashboardTablePage,
  DashboardTablePageBody,
  DashboardTablePageHeader,
} from "@/components/dashboard/dashboard-page";

export function ProjectWorkforceSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </DashboardPageHeader>

      <DashboardTablePage>
        <DashboardTablePageHeader>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
        </DashboardTablePageHeader>
        <DashboardTablePageBody>
          <div className="divide-y divide-border/70 border-border md:border-x">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="grid gap-4 px-3 py-4 md:grid-cols-[1fr_8rem_7rem_10rem]"
                key={index.toString()}
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
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

      <DashboardSection>
        <DashboardSectionHeader>
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </DashboardSectionHeader>
        <div className="rounded-[1.25rem] border border-border/70 bg-card/82 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="grid gap-4 px-3 py-4 md:grid-cols-[1fr_7rem_6rem_7rem_7rem_8rem]"
                key={index.toString()}
              >
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-10 justify-self-end" />
                <Skeleton className="h-4 w-20 justify-self-end" />
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
