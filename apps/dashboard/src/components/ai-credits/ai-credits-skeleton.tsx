import { Skeleton } from "@plotkeys/ui/skeleton";

const summarySkeletons = ["balance", "used", "calls"];
const creditSections = ["top-up", "usage"];
const creditRows = ["first", "second", "third", "fourth", "fifth"];

export function AiCreditsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {summarySkeletons.map((summary) => (
          <div
            className="border border-border bg-card p-5 transition-all duration-300"
            key={summary}
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-6 w-16" />
            <Skeleton className="mt-2 h-4 w-28" />
          </div>
        ))}
      </div>

      {creditSections.map((section) => (
        <section className="space-y-3" key={section}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-96 max-w-full" />
          </div>
          <div className="border bg-background p-5">
            <div className="space-y-3">
              {creditRows.slice(0, section === "top-up" ? 2 : 5).map((row) => (
                <Skeleton className="h-12 w-full" key={`${section}-${row}`} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
