"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import {
  isLeaveRequestStatus,
  type LeaveRequestStatus,
} from "@/components/leave-requests/leave-request-utils";
import { useLeaveRequestsFilterParams } from "@/hooks/use-leave-requests-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import {
  LeaveRequestsEmptyState,
  LeaveRequestsNoResults,
} from "./empty-states";
import { LeaveRequestsDataTable } from "./table";
import { LeaveRequestsPageHeader } from "./table-header";

type LeaveRequestsTableProps = {
  initialSettings?: Partial<TableSettings>;
};

export function LeaveRequestsTable({
  initialSettings,
}: LeaveRequestsTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useLeaveRequestsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const statusParam = filters.status ?? undefined;
  const activeStatus: LeaveRequestStatus | undefined = isLeaveRequestStatus(
    statusParam,
  )
    ? statusParam
    : undefined;
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
    status: activeStatus,
  };
  const { data: stats } = useSuspenseQuery(
    trpc.workspace.getLeaveRequestStats.queryOptions(),
  );
  const infiniteQueryOptions =
    trpc.workspace.listLeaveRequests.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const requests = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const requestCount = data.pages[0]?.meta.count ?? requests.length;

  return (
    <div className="flex flex-col gap-5">
      <LeaveRequestsPageHeader activeStatus={activeStatus} stats={stats} />

      {requests.length ? (
        <DashboardTablePage>
          <LeaveRequestsDataTable
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
            requestCount={requestCount}
            requests={requests}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <LeaveRequestsNoResults onClear={() => setFilters(null)} />
      ) : (
        <LeaveRequestsEmptyState activeStatus={activeStatus} />
      )}
    </div>
  );
}
