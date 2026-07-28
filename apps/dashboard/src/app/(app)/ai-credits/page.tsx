import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { AiCreditsContent } from "@/components/ai-credits/ai-credits-content";
import { AiCreditsSkeleton } from "@/components/ai-credits/ai-credits-skeleton";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "AI Credits | Plot Keys",
};

export default async function AiCreditsPage() {
  await requireOnboardedSession();

  prefetch(trpc.aiCredits.get.queryOptions());

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<AiCreditsSkeleton />}>
            <AiCreditsContent />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
