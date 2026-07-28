"use client";

import { Skeleton } from "@plotkeys/ui/skeleton";

export function CustomerDetailsSkeleton() {
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 pb-4 pt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
