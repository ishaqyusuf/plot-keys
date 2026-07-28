import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";

import { ErrorFallback } from "@/components/error-fallback";
import { LivePreviewContent } from "@/components/live/live-preview-content";
import { LivePreviewSkeleton } from "@/components/live/live-preview-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export const metadata: Metadata = {
  title: "Live Preview | Plot Keys",
};

export default async function LivePage({ searchParams }: Props) {
  await requireOnboardedSession();

  const params = await searchParams;
  const hostname = firstSearchParam(params.hostname);
  const subdomain = firstSearchParam(params.subdomain);

  return (
    <ScrollableContent>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<LivePreviewSkeleton />}>
          <LivePreviewContent hostname={hostname} subdomain={subdomain} />
        </Suspense>
      </ErrorBoundary>
    </ScrollableContent>
  );
}
