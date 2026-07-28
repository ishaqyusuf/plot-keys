import { Skeleton } from "@plotkeys/ui/skeleton";

const reportSections = ["summary", "agents", "listings"];
const reportRows = ["first", "second", "third", "fourth", "fifth"];

export function ReportsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {reportSections.map((section) => (
        <section className="space-y-3" key={section}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
          <div className="border border-border bg-card p-5 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="mt-5 space-y-3">
              {reportRows.map((row) => (
                <Skeleton className="h-10 w-full" key={`${section}-${row}`} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
