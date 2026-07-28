import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { LeadsHeader } from "@/components/leads-header";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/leads/data-table";
import { LeadsSkeleton } from "@/components/tables/leads/skeleton";
import {
  loadLeadFilterParams,
  resolveLeadListInput,
} from "@/hooks/use-lead-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Leads | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function LeadsPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadLeadFilterParams(params);
  const { sort } = loadSortParams(params);
  const initialSettings = await getInitialTableSettings("leads");
  const listInput = resolveLeadListInput(filters, sort);

  batchPrefetch([
    trpc.leads.stats.queryOptions(),
    trpc.leads.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <LeadsHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<LeadsSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
