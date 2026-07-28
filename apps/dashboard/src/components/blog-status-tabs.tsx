"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  blogPostStatusConfig,
  blogPostStatuses,
  isBlogPostStatus,
} from "@/components/blog/blog-utils";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import { useBlogFilterParams } from "@/hooks/use-blog-filter-params";
import { useTRPC } from "@/trpc/client";

export function BlogStatusTabs() {
  const trpc = useTRPC();
  const { filter } = useBlogFilterParams();
  const { data: stats } = useSuspenseQuery(trpc.blog.stats.queryOptions());
  const activeStatus = isBlogPostStatus(filter.status ?? undefined)
    ? filter.status
    : undefined;

  return (
    <HeaderLinkTabList>
      <HeaderLinkTab active={!activeStatus} href="/blog">
        All ({stats.total})
      </HeaderLinkTab>
      {blogPostStatuses.map((status) => (
        <HeaderLinkTab
          active={activeStatus === status}
          href={`/blog?status=${status}`}
          key={status}
        >
          {blogPostStatusConfig[status].label} ({stats[status] ?? 0})
        </HeaderLinkTab>
      ))}
    </HeaderLinkTabList>
  );
}
