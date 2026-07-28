import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { ErrorFallback } from "@/components/error-fallback";
import { IntegrationsContent } from "@/components/integrations/integrations-content";
import { IntegrationsSkeleton } from "@/components/integrations/integrations-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Integrations | Plot Keys",
};

export default async function IntegrationsPage() {
  await requireOnboardedSession();

  prefetch(trpc.integrations.get.queryOptions());

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<IntegrationsSkeleton />}>
            <IntegrationsContent />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
