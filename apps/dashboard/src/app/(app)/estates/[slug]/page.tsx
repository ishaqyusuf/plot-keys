import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { EstateDetailContent } from "@/components/estates/estate-detail-content";
import { EstateDetailSkeleton } from "@/components/estates/estate-detail-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Estate launch | Plot Keys",
};

export default async function EstateDetailPage({ params }: Props) {
  await requireOnboardedSession();
  const { slug } = await params;

  prefetch(trpc.estates.get.queryOptions({ slug }));

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<EstateDetailSkeleton />}>
            <EstateDetailContent slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
