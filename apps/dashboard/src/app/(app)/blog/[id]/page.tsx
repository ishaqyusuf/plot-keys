import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { BlogDetailTable } from "@/components/tables/blog/detail";
import { BlogDetailSkeleton } from "@/components/tables/blog/detail-skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Edit blog post | Plot Keys",
};

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ created?: string; saved?: string }>;
};

export default async function BlogDetailPage({
  params,
  searchParams,
}: BlogDetailPageProps) {
  await requireOnboardedSession();
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const notice = sp.created ? "created" : sp.saved ? "saved" : undefined;

  batchPrefetch([trpc.workspace.getBlogPost.queryOptions({ blogPostId: id })]);

  return (
    <DashboardPage className="max-w-none">
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<BlogDetailSkeleton />}>
            <BlogDetailTable blogPostId={id} notice={notice} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
