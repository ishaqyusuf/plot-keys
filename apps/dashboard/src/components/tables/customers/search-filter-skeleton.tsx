import { Skeleton } from "@plotkeys/ui/skeleton";

export function CustomersSearchFilterSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
      <Skeleton className="h-9 w-full rounded-md lg:w-[350px]" />
      <div className="flex gap-2 overflow-hidden">
        <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
        <Skeleton className="h-8 w-28 shrink-0 rounded-full" />
      </div>
    </div>
  );
}
