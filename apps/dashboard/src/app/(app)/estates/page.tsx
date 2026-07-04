import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { EstatesTable } from "@/components/tables/estates";
import { EstatesSkeleton } from "@/components/tables/estates/skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Estate Launches | Plot Keys",
};

type EstatesPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function EstatesPage({ searchParams }: EstatesPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  batchPrefetch([trpc.workspace.listEstates.queryOptions()]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<EstatesSkeleton />}>
            <EstatesTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
