"use client";

import { Skeleton } from "@plotkeys/ui/skeleton";

export function CustomerSummarySkeleton() {
  return (
    <div className="hidden border border-border bg-card p-5 transition-all duration-300 sm:block">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-6 w-16" />
      <Skeleton className="mt-2 h-4 w-44" />
    </div>
  );
}
