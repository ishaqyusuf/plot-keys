import { Skeleton } from "@plotkeys/ui/skeleton";

const estateDetailStats = ["plots", "reserved", "available", "revenue"];
const estateDetailSections = ["brief", "features", "offers", "pipeline"];

export function EstateDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {estateDetailStats.map((stat) => (
          <div
            className="border border-border bg-card p-5 transition-all duration-300"
            key={stat}
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-6 w-16" />
          </div>
        ))}
      </div>

      {estateDetailSections.map((section) => (
        <section className="space-y-3" key={section}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="border bg-background p-5">
            <Skeleton className="h-48 w-full" />
          </div>
        </section>
      ))}
    </div>
  );
}
