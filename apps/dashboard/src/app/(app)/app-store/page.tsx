import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";

import { AppStoreContent } from "@/components/app-store/app-store-content";
import { AppStoreHeader } from "@/components/app-store/app-store-header";
import { AppStoreSkeleton } from "@/components/app-store/app-store-skeleton";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "App Store | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AppStorePage({ searchParams }: Props) {
  await requireOnboardedSession();

  const params = await searchParams;
  const q = firstSearchParam(params.q);
  const tab = firstSearchParam(params.tab);

  return (
    <ScrollableContent>
      <div className="mt-4">
        <AppStoreHeader />

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<AppStoreSkeleton />}>
            <AppStoreContent q={q} tab={tab} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ScrollableContent>
  );
}
