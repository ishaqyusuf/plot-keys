import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { BillingInterval } from "@plotkeys/utils";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { BillingTable } from "@/components/tables/billing";
import { BillingSkeleton } from "@/components/tables/billing/skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Billing & Plans | Plot Keys",
};

type BillingPageProps = {
  searchParams?: Promise<{
    interval?: string;
    payment?: string;
    success?: string;
  }>;
};

function resolveBillingInterval(interval?: string): BillingInterval {
  return interval === "annual" ? "annual" : "monthly";
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const selectedInterval = resolveBillingInterval(params.interval);

  batchPrefetch([trpc.workspace.getBillingInfo.queryOptions()]);

  return (
    <DashboardPage>
      {params.success === "1" ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>
            Payment successful. Your plan has been updated.
          </AlertDescription>
        </Alert>
      ) : null}

      {params.payment ? (
        <Alert className="border-amber-300/60 bg-amber-50/35 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/15 dark:text-amber-100">
          <AlertDescription>
            We could not confirm that payment yet. Please retry or contact
            support with your Paystack reference.
          </AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<BillingSkeleton />}>
            <BillingTable selectedInterval={selectedInterval} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
