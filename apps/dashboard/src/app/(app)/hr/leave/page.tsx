import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { isLeaveRequestStatus } from "@/components/leave-requests/leave-request-utils";
import { LeaveRequestsTable } from "@/components/tables/leave-requests";
import { LeaveRequestsSkeleton } from "@/components/tables/leave-requests/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadLeaveRequestsFilterParams } from "@/lib/leave-requests-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Leave Requests | Plot Keys",
};

type LeavePageProps = {
  searchParams?: Promise<
    SearchParams & {
      created?: string;
      error?: string;
      q?: string;
      sort?: string | string[];
      status?: string;
    }
  >;
};

export default async function LeavePage({ searchParams }: LeavePageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadLeaveRequestsFilterParams(params);
  const { sort } = loadSortParams(params);
  const statusParam = filters.status ?? undefined;
  const status = isLeaveRequestStatus(statusParam) ? statusParam : undefined;
  const listInput = { q: filters.q, sort, status };
  const initialSettings = await getInitialTableSettings("leave-requests");

  batchPrefetch([
    trpc.workspace.getLeaveRequestStats.queryOptions(),
    trpc.workspace.listLeaveRequests.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    trpc.workspace.listEmployees.queryOptions({
      size: 200,
      status: "active",
    }),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.created ? (
        <Alert>
          <AlertDescription>Leave request submitted.</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<LeaveRequestsSkeleton />}>
            <LeaveRequestsTable initialSettings={initialSettings} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
