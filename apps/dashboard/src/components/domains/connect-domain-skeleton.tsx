import { Skeleton } from "@plotkeys/ui/skeleton";

const setupSteps = ["register", "dns", "verify"];

export function ConnectDomainSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <section className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="border bg-background p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid gap-2.5 lg:grid-cols-3">
          {setupSteps.map((step) => (
            <div className="border bg-background p-5" key={step}>
              <Skeleton className="size-4" />
              <Skeleton className="mt-4 h-5 w-36" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </div>
        <Skeleton className="h-32 w-full" />
      </section>
    </div>
  );
}
