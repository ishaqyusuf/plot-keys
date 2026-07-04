import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { IntegrationsTable } from "@/components/tables/integrations";
import { IntegrationsSkeleton } from "@/components/tables/integrations/skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Integrations | Plot Keys",
};

export default async function IntegrationsPage() {
  await requireOnboardedSession();

  batchPrefetch([trpc.workspace.getCompanyIntegration.queryOptions()]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<IntegrationsSkeleton />}>
            <IntegrationsTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
