import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { isBlogPostStatus } from "@/components/blog/blog-utils";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { BlogTable } from "@/components/tables/blog";
import { BlogSkeleton } from "@/components/tables/blog/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadBlogFilterParams } from "@/lib/blog-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Blog | Plot Keys",
};

type BlogPageProps = {
  searchParams?: Promise<
    SearchParams & {
      error?: string;
      q?: string;
      sort?: string | string[];
      status?: string;
    }
  >;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  await requireOnboardedSession();
  const sp = (await searchParams) ?? {};
  const filters = loadBlogFilterParams(sp);
  const { sort } = loadSortParams(sp);
  const statusParam = filters.status ?? undefined;
  const status = isBlogPostStatus(statusParam)
    ? statusParam
    : undefined;
  const listInput = { q: filters.q, sort, status };
  const initialSettings = await getInitialTableSettings("blog");

  batchPrefetch([
    trpc.workspace.getBlogPostStats.queryOptions(),
    trpc.workspace.listBlogPosts.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <DashboardPage>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<BlogSkeleton />}>
            <BlogTable initialSettings={initialSettings} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
