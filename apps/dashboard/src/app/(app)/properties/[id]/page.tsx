import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { PropertyDetailTable } from "@/components/tables/properties/detail";
import { PropertyDetailSkeleton } from "@/components/tables/properties/detail-skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    imageProvider?: string;
    imageQuery?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Listing details | Plot Keys",
};

export default async function PropertyDetailPage({
  params,
  searchParams,
}: PropertyDetailPageProps) {
  const session = await requireOnboardedSession();
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const canEdit =
    session.activeMembership.role === "owner" ||
    session.activeMembership.role === "admin" ||
    session.activeMembership.role === "agent";

  batchPrefetch([
    trpc.workspace.getPropertyDetail.queryOptions({ propertyId: id }),
    trpc.propertyMedia.listMedia.queryOptions({ propertyId: id }),
  ]);

  return (
    <DashboardPage>
      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<PropertyDetailSkeleton />}>
            <PropertyDetailTable
              canEdit={canEdit}
              imageProvider={sp.imageProvider}
              imageQuery={sp.imageQuery}
              propertyId={id}
            />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
