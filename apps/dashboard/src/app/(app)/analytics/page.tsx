import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { AnalyticsContent } from "@/components/analytics";
import { AnalyticsSkeleton } from "@/components/analytics/skeleton";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Analytics | Plot Keys",
};

export default async function AnalyticsPage() {
  await requireOnboardedSession();

  prefetch(trpc.analytics.get.queryOptions());

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsContent />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
