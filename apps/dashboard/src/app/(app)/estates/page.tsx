import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { ErrorFallback } from "@/components/error-fallback";
import { EstatesContent } from "@/components/estates/estates-content";
import { EstatesSkeleton } from "@/components/estates/estates-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Estate Launches | Plot Keys",
};

export default async function EstatesPage() {
  await requireOnboardedSession();

  prefetch(trpc.estates.list.queryOptions());

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<EstatesSkeleton />}>
            <EstatesContent />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
