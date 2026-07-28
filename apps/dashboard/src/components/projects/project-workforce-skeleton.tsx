import { Skeleton } from "@plotkeys/ui/skeleton";

const workerRows = ["first", "second", "third", "fourth"];
const payrollRows = ["first", "second", "third"];

export function ProjectWorkforceSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <section className="overflow-hidden border bg-background">
        <div className="border-b border-border px-5 py-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
        </div>
        <div>
          <div className="divide-y divide-border border-border md:border-x">
            {workerRows.map((row) => (
              <div
                className="grid gap-4 px-3 py-4 md:grid-cols-[1fr_8rem_7rem_10rem]"
                key={row}
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
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

      <section className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="border bg-background p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
            {payrollRows.map((row) => (
              <div
                className="grid gap-4 px-3 py-4 md:grid-cols-[1fr_7rem_6rem_7rem_7rem_8rem]"
                key={row}
              >
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-10 justify-self-end" />
                <Skeleton className="h-4 w-20 justify-self-end" />
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
