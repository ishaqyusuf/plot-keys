import { Skeleton } from "@plotkeys/ui/skeleton";

export function QaMaintenanceSkeleton() {
  return (
    <div className="grid gap-6">
      <section className="border border-border bg-card p-5">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
        <div className="mt-5 grid gap-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="mt-5 h-9 w-44" />
      </section>

      <section className="border border-border bg-card p-5">
        <Skeleton className="h-5 w-28" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["companies", "users", "domains", "assets"].map((key) => (
            <Skeleton className="h-16 w-full" key={key} />
          ))}
        </div>
        <Skeleton className="mt-5 h-10 w-full" />
        <Skeleton className="mt-3 h-9 w-52" />
      </section>
    </div>
  );
}
