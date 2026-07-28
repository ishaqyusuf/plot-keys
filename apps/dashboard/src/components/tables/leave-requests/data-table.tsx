"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo, useRef } from "react";
import {
  BulkClientAction,
  CoreDataTableContent,
  CoreDataTableShell,
  useDashboardTable,
  useDashboardTableRuntime,
  useDashboardTableSettings,
} from "@/components/tables/core";
import {
  resolveLeaveRequestsListInput,
  useLeaveRequestsFilterParams,
} from "@/hooks/use-leave-requests-filter-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useLeaveRequestsStore } from "@/store/leave-requests";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { columns, type LeaveRequestTableRow } from "./columns";
import { EmptyState, NoResults } from "./empty-states";
import { DataTableHeader } from "./table-header";

type Props = {
  initialSettings?: Partial<TableSettings>;
};

export function DataTable({ initialSettings }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  useScrollHeader(parentRef);
  const { rowSelection, setColumns, setRowSelection } = useLeaveRequestsStore();
  const { filter, hasFilters } = useLeaveRequestsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filter.q);
  const {
    columnVisibility,
    setColumnVisibility,
    columnSizing,
    setColumnSizing,
    columnOrder,
    setColumnOrder,
  } = useDashboardTableSettings({
    columns,
    initialSettings,
    tableId: "leave-requests",
  });
  const listInput = resolveLeaveRequestsListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.leaveRequests.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: requests } = useMemo(
    () => getDashboardInfiniteListState<LeaveRequestTableRow>(data.pages),
    [data.pages],
  );
  const invalidateLeaveRequests = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.leaveRequests.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.leaveRequests.stats.queryKey(),
      }),
    ]);
  }, [queryClient, trpc]);
  const updateLeaveRequestsStatusMutation = useMutation(
    trpc.leaveRequests.updateManyStatus.mutationOptions({
      onSuccess: invalidateLeaveRequests,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: requests,
    rowSelection,
    setColumnOrder,
    setColumnSizing,
    setColumnVisibility,
    setRowSelection,
  });

  const { clearSelection, contentRuntime, selectedIds, shellRuntime } =
    useDashboardTableRuntime({
      columnVisibility,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      parentRef,
      rowSelection,
      setColumns,
      setRowSelection,
      table,
      tableId: "leave-requests",
    });
  const handleBulkStatusUpdate = useCallback(
    (status: "approved" | "cancelled" | "rejected") => {
      updateLeaveRequestsStatusMutation.mutate({
        leaveRequestIds: selectedIds,
        status,
      });
      clearSelection();
    },
    [clearSelection, selectedIds, updateLeaveRequestsStatusMutation],
  );

  if (hasFilters && !requests.length) {
    return <NoResults />;
  }

  if (!requests.length) {
    return <EmptyState activeStatus={listInput.status} />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <>
          <BulkClientAction
            isSubmitting={updateLeaveRequestsStatusMutation.isPending}
            onClick={() => handleBulkStatusUpdate("approved")}
          >
            Approve
          </BulkClientAction>
          <BulkClientAction
            isSubmitting={updateLeaveRequestsStatusMutation.isPending}
            onClick={() => handleBulkStatusUpdate("rejected")}
            variant="destructive"
          >
            Reject
          </BulkClientAction>
          <BulkClientAction
            isSubmitting={updateLeaveRequestsStatusMutation.isPending}
            onClick={() => handleBulkStatusUpdate("cancelled")}
          >
            Cancel
          </BulkClientAction>
        </>
      }
      runtime={shellRuntime}
    >
      <CoreDataTableContent
        table={table}
        header={DataTableHeader}
        runtime={contentRuntime}
      />
    </CoreDataTableShell>
  );
}
