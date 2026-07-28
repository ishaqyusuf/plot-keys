import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { LeaveRequestsHeader } from "@/components/leave-requests-header";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/leave-requests/data-table";
import { LeaveRequestsSkeleton } from "@/components/tables/leave-requests/skeleton";
import {
  loadLeaveRequestsFilterParams,
  resolveLeaveRequestsListInput,
} from "@/hooks/use-leave-requests-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Leave Requests | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function LeavePage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadLeaveRequestsFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveLeaveRequestsListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("leave-requests");

  batchPrefetch([
    trpc.leaveRequests.stats.queryOptions(),
    trpc.leaveRequests.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    trpc.employees.list.queryOptions({
      size: 200,
      status: "active",
    }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <LeaveRequestsHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<LeaveRequestsSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
