import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { isLeadStatus } from "@/components/leads/lead-utils";
import { LeadsTable } from "@/components/tables/leads";
import { LeadsSkeleton } from "@/components/tables/leads/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadLeadsFilterParams } from "@/lib/leads-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Leads | Plot Keys",
};

type LeadsPageProps = {
  searchParams?: Promise<
    SearchParams & {
      q?: string;
      sort?: string | string[];
      status?: string;
    }
  >;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadLeadsFilterParams(params);
  const { sort } = loadSortParams(params);
  const statusParam = filters.status ?? undefined;
  const status = isLeadStatus(statusParam) ? statusParam : undefined;
  const initialSettings = await getInitialTableSettings("leads");
  const listInput = { q: filters.q, sort, status };

  batchPrefetch([
    trpc.workspace.getLeadStats.queryOptions(),
    trpc.workspace.listLeads.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<LeadsSkeleton />}>
            <LeadsTable initialSettings={initialSettings} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
