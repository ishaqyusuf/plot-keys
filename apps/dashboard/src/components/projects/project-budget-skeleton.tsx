import { Skeleton } from "@plotkeys/ui/skeleton";

const budgetSummaryCards = ["approved", "forecast", "actual", "variance"];
const budgetRows = ["first", "second", "third", "fourth"];

export function ProjectBudgetSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <section className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="border bg-background p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {budgetSummaryCards.map((card) => (
              <div
                className="border border-border bg-card p-4 transition-all duration-300"
                key={card}
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border bg-background">
        <div className="border-b border-border px-5 py-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>
        <div>
          <div className="divide-y divide-border border-border md:border-x">
            {budgetRows.map((row) => (
              <div
                className="grid gap-4 px-3 py-4 md:grid-cols-[1fr_9rem_7rem_7rem]"
                key={row}
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
        </div>
      </section>
    </div>
  );
}
