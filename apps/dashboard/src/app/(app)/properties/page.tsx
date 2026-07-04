import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { buildTenantSiteUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { PropertiesTable } from "@/components/tables/properties";
import { PropertiesSkeleton } from "@/components/tables/properties/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { getBaseUrl } from "@/lib/get-base-url";
import { loadPropertiesFilterParams } from "@/lib/properties-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

type PropertiesPageProps = {
  searchParams?: Promise<
    SearchParams & {
      error?: string;
      q?: string;
      sort?: string | string[];
      type?: string;
    }
  >;
};

export const metadata: Metadata = {
  title: "Listings | Plot Keys",
};

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadPropertiesFilterParams(params);
  const { sort } = loadSortParams(params);
  const initialSettings = await getInitialTableSettings("properties");
  const currentOrigin = await getBaseUrl();
  const siteUrl = buildTenantSiteUrl(session.activeMembership.companySlug, {
    currentOrigin,
  });

  batchPrefetch([
    trpc.filters.properties.queryOptions(),
    trpc.workspace.listProperties.infiniteQueryOptions(
      { ...filters, sort },
      {
        getNextPageParam: ({ meta }) => meta?.cursor,
      },
    ),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<PropertiesSkeleton />}>
            <PropertiesTable
              initialSettings={initialSettings}
              siteUrl={siteUrl}
            />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
