import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DomainsContent } from "@/components/domains/domains-content";
import { DomainsSkeleton } from "@/components/domains/domains-skeleton";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Domains | Plot Keys",
};

export default async function DomainsPage() {
  await requireOnboardedSession();

  batchPrefetch([
    trpc.domains.status.queryOptions(),
    trpc.domains.dnsInstructions.queryOptions(),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<DomainsSkeleton />}>
            <DomainsContent />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
