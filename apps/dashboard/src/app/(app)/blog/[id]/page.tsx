import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { BlogDetailContent } from "@/components/blog/blog-detail-content";
import { BlogDetailSkeleton } from "@/components/blog/blog-detail-skeleton";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Edit blog post | Plot Keys",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  await requireOnboardedSession();
  const { id } = await params;

  prefetch(trpc.blog.get.queryOptions({ blogPostId: id }));

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<BlogDetailSkeleton />}>
            <BlogDetailContent blogPostId={id} />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
