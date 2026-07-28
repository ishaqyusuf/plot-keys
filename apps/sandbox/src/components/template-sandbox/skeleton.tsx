import { Skeleton } from "@plotkeys/ui/skeleton";

const profileFormFields = [
  "name",
  "template",
  "company",
  "market",
  "subdomain",
  "plan",
];
const profileRows = ["first", "second", "third", "fourth"];

export function TemplateSandboxSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="border bg-background p-5">
          <div className="space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-full max-w-xs" />
            {profileFormFields.map((field) => (
              <Skeleton className="h-10 w-full" key={field} />
            ))}
          </div>
        </div>

        <section className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3 w-80 max-w-full" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid gap-3">
            {profileRows.map((row) => (
              <div className="border bg-background p-4" key={row}>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-full max-w-lg" />
                    <Skeleton className="h-3 w-full max-w-md" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
