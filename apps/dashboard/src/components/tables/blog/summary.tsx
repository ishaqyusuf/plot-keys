"use client";

import { Card, CardContent } from "@plotkeys/ui/card";
import { DashboardStatGrid } from "@/components/dashboard/dashboard-page";
import {
  blogPostStatuses,
  blogPostStatusConfig,
  type BlogPostStatus,
} from "@/components/blog/blog-utils";

type BlogSummaryProps = {
  stats: Record<BlogPostStatus | "total", number>;
};

export function BlogSummary({ stats }: BlogSummaryProps) {
  return (
    <DashboardStatGrid className="xl:grid-cols-3">
      {blogPostStatuses.map((status) => (
        <Card className="border-border/65 bg-card/78" key={status}>
          <CardContent className="px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {blogPostStatusConfig[status].label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {stats[status] ?? 0}
            </p>
          </CardContent>
        </Card>
      ))}
    </DashboardStatGrid>
  );
}
