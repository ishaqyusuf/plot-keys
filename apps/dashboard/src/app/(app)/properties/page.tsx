import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { PropertiesHeader } from "@/components/properties-header";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/properties/data-table";
import { PropertiesSkeleton } from "@/components/tables/properties/skeleton";
import {
  loadPropertyFilterParams,
  resolvePropertyListInput,
} from "@/hooks/use-property-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

type Props = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = {
  title: "Listings | Plot Keys",
};

export default async function PropertiesPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadPropertyFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolvePropertyListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("properties");

  batchPrefetch([
    trpc.filters.properties.queryOptions(),
    trpc.properties.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <PropertiesHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<PropertiesSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
