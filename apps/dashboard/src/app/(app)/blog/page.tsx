import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { BlogSummary } from "@/components/blog/blog-summary";
import { BlogHeader } from "@/components/blog-header";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/blog/data-table";
import { BlogSkeleton } from "@/components/tables/blog/skeleton";
import {
  loadBlogFilterParams,
  resolveBlogListInput,
} from "@/hooks/use-blog-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Blog | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function BlogPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const sp = await searchParams;
  const filters = loadBlogFilterParams(sp);
  const { sort } = loadSortParams(sp);
  const listInput = resolveBlogListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("blog");

  batchPrefetch([
    trpc.blog.stats.queryOptions(),
    trpc.blog.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <BlogHeader />
          <BlogSummary />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<BlogSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
