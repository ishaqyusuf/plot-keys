import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { AiCreditsTable } from "@/components/tables/ai-credits";
import { AiCreditsSkeleton } from "@/components/tables/ai-credits/skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "AI Credits | Plot Keys",
};

export default async function AiCreditsPage() {
  await requireOnboardedSession();

  batchPrefetch([trpc.workspace.getAiCreditInfo.queryOptions()]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<AiCreditsSkeleton />}>
            <AiCreditsTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
