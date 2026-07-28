import { Skeleton } from "@plotkeys/ui/skeleton";

const homeStats = ["properties", "agents", "leads", "appointments"];
const homeSections = ["publishing", "quick-actions"];

function DashboardHomeHeaderSkeleton() {
  return (
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
  );
}

function DashboardHomeStatCardSkeleton() {
  return (
    <div className="border border-border p-5 min-h-[110px] flex flex-col justify-between">
      <Skeleton className="h-[14px] w-[80px]" />
      <Skeleton className="mt-3 h-[28px] w-[100px]" />
    </div>
  );
}

function DashboardHomeSectionSkeleton() {
  return (
    <section className="space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-72 max-w-full" />
      </div>
      <div className="border bg-background p-5">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-5 h-14 w-full" />
        <Skeleton className="mt-4 h-9 w-36" />
      </div>
    </section>
  );
}

export function DashboardHomeSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <DashboardHomeHeaderSkeleton />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {homeStats.map((stat) => (
          <DashboardHomeStatCardSkeleton key={stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {homeSections.map((section) => (
          <DashboardHomeSectionSkeleton key={section} />
        ))}
      </div>
    </div>
  );
}
