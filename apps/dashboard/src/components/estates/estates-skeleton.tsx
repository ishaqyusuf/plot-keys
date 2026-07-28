import { Skeleton } from "@plotkeys/ui/skeleton";

const estateStats = ["launches", "published", "listings", "requests"];
const estateCards = ["first", "second", "third", "fourth", "fifth", "sixth"];

export function EstatesSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {estateStats.map((stat) => (
          <div
            className="border border-border bg-card p-5 transition-all duration-300"
            key={stat}
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-6 w-16" />
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-96 max-w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {estateCards.map((card) => (
            <div className="border bg-background p-5" key={card}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="mt-5 h-16 w-full" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
