import { Skeleton } from "@plotkeys/ui/skeleton";

const previewSections = ["hero", "listings", "agents", "contact"];

export function LivePreviewSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[82rem] flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <div className="overflow-hidden border bg-background">
        <Skeleton className="h-72 w-full rounded-none" />
        <div className="grid gap-0 md:grid-cols-2">
          {previewSections.map((section) => (
            <div className="border-t border-border p-6" key={section}>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-3 h-4 w-full max-w-sm" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
