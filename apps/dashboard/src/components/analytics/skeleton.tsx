import { Skeleton } from "@plotkeys/ui/skeleton";

const metricSkeletons = ["events", "visitors", "views", "leads"];
const sectionSkeletons = ["events", "pages", "demand", "recent"];
const sectionRows = ["first", "second", "third", "fourth"];

export function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metricSkeletons.map((metric) => (
          <div
            className="border border-border bg-card p-5 transition-all duration-300"
            key={metric}
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {sectionSkeletons.map((section) => (
            <div
              className="border border-border bg-card p-5 transition-all duration-300"
              key={section}
            >
              <Skeleton className="h-4 w-36" />
              <div className="mt-5 space-y-3">
                {sectionRows.map((row) => (
                  <Skeleton className="h-10 w-full" key={`${section}-${row}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
