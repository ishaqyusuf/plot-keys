"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  blogPostStatusConfig,
  blogPostStatuses,
} from "@/components/blog/blog-utils";
import { useTRPC } from "@/trpc/client";

export function BlogSummary() {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(trpc.blog.stats.queryOptions());

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {blogPostStatuses.map((status) => (
        <div
          className="border border-border bg-card p-5 transition-all duration-300"
          key={status}
        >
          <p className="text-xs text-muted-foreground">
            {blogPostStatusConfig[status].label}
          </p>
          <p className="mt-3 text-xl font-medium">{stats[status] ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
