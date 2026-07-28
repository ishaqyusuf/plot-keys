import { Skeleton } from "@plotkeys/ui/skeleton";

export function BlogDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
      </div>

      <section className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="border bg-background p-5">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-80 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
