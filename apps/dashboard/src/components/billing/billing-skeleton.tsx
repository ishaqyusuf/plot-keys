import { Skeleton } from "@plotkeys/ui/skeleton";

const billingSections = ["current", "plans", "repair", "history"];
const billingRows = ["first", "second", "third"];

export function BillingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-3">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      {billingSections.map((section) => (
        <section className="space-y-3" key={section}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
          <div className="border bg-background p-5">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-7 w-24" />
            </div>
            <div className="mt-5 space-y-3">
              {billingRows.slice(0, section === "plans" ? 3 : 2).map((row) => (
                <Skeleton className="h-12 w-full" key={`${section}-${row}`} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
