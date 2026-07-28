import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { ConnectDomainContent } from "@/components/domains/connect-domain-content";
import { ConnectDomainSkeleton } from "@/components/domains/connect-domain-skeleton";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Connect Domain | Plot Keys",
};

export default async function ConnectDomainPage() {
  await requireOnboardedSession();

  return (
    <ScrollableContent>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<ConnectDomainSkeleton />}>
          <ConnectDomainContent />
        </Suspense>
      </ErrorBoundary>
    </ScrollableContent>
  );
}
