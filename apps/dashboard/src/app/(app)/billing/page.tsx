import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { BillingContent } from "@/components/billing/billing-content";
import { BillingSkeleton } from "@/components/billing/billing-skeleton";
import { resolveBillingInterval } from "@/components/billing/billing-utils";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Billing & Plans | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BillingPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const selectedInterval = resolveBillingInterval(
    firstSearchParam(params.interval),
  );

  prefetch(trpc.billing.getInfo.queryOptions());

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<BillingSkeleton />}>
            <BillingContent selectedInterval={selectedInterval} />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
