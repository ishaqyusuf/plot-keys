import { Skeleton } from "@plotkeys/ui/skeleton";

import {
  DashboardPageHeader,
  DashboardSection,
} from "@/components/dashboard/dashboard-page";

export function SettingsSkeleton() {
  return (
    <>
      <DashboardPageHeader>
        <div className="space-y-3">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </DashboardPageHeader>

      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <DashboardSection key={sectionIndex.toString()}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-96 max-w-full" />
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-card/82 p-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </DashboardSection>
      ))}
    </>
  );
}
