import { Skeleton } from "@plotkeys/ui/skeleton";

const domainSections = ["control", "dns", "domains"];
const domainRows = ["first", "second", "third"];

export function DomainsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-3">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-36" />
      </div>

      {domainSections.map((section) => (
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
              {domainRows.map((row) => (
                <Skeleton className="h-12 w-full" key={`${section}-${row}`} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
