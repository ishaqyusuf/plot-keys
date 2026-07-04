import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { AnalyticsDashboard } from "@/components/analytics";
import { AnalyticsSkeleton } from "@/components/analytics/skeleton";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Analytics | Plot Keys",
};

export default async function AnalyticsPage() {
  await requireOnboardedSession();

  batchPrefetch([trpc.workspace.getAnalytics.queryOptions()]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsDashboard />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
