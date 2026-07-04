"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import {
  isBlogPostStatus,
  type BlogPostStatus,
} from "@/components/blog/blog-utils";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { useBlogFilterParams } from "@/hooks/use-blog-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { BlogEmptyState, BlogNoResults } from "./empty-states";
import { BlogSummary } from "./summary";
import { BlogDataTable } from "./table";
import { BlogPageHeader } from "./table-header";

type BlogTableProps = {
  initialSettings?: Partial<TableSettings>;
};

export function BlogTable({ initialSettings }: BlogTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useBlogFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const statusParam = filters.status ?? undefined;
  const activeStatus: BlogPostStatus | undefined = isBlogPostStatus(statusParam)
    ? statusParam
    : undefined;
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
    status: activeStatus,
  };
  const { data: stats } = useSuspenseQuery(
    trpc.workspace.getBlogPostStats.queryOptions(),
  );
  const infiniteQueryOptions =
    trpc.workspace.listBlogPosts.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const posts = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const postCount = data.pages[0]?.meta.count ?? posts.length;

  return (
    <div className="flex flex-col gap-5">
      <BlogPageHeader activeStatus={activeStatus} stats={stats} />
      <BlogSummary stats={stats} />

      {posts.length ? (
        <DashboardTablePage>
          <BlogDataTable
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
            postCount={postCount}
            posts={posts}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <BlogNoResults onClear={() => setFilters(null)} />
      ) : (
        <BlogEmptyState activeStatus={activeStatus} />
      )}
    </div>
  );
}
