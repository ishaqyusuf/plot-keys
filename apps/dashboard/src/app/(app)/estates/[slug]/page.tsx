import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { EstateDetailTable } from "@/components/tables/estates/detail";
import { EstateDetailSkeleton } from "@/components/tables/estates/detail-skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

type EstateDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Estate launch | Plot Keys",
};

export default async function EstateDetailPage({
  params,
  searchParams,
}: EstateDetailPageProps) {
  await requireOnboardedSession();
  const { slug } = await params;
  const sp = (await searchParams) ?? {};

  batchPrefetch([trpc.workspace.getEstateDetail.queryOptions({ slug })]);

  return (
    <DashboardPage>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<EstateDetailSkeleton />}>
            <EstateDetailTable slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
