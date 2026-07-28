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
  resolveNotificationsListInput,
  useNotificationsFilterParams,
} from "@/hooks/use-notifications-filter-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useNotificationsStore } from "@/store/notifications";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { columns, type NotificationTableRow } from "./columns";
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
  const { rowSelection, setColumns, setRowSelection } = useNotificationsStore();
  const { filter, hasFilters } = useNotificationsFilterParams();
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
    tableId: "notifications",
  });
  const listInput = resolveNotificationsListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.notifications.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: notifications } = useMemo(
    () => getDashboardInfiniteListState<NotificationTableRow>(data.pages),
    [data.pages],
  );
  const invalidateNotifications = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.unreadCount.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.bell.queryKey(),
      }),
    ]);
  }, [queryClient, trpc]);
  const markManyReadMutation = useMutation(
    trpc.notifications.markManyRead.mutationOptions({
      onSuccess: invalidateNotifications,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: notifications,
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
      tableId: "notifications",
    });
  const handleMarkSelectedRead = useCallback(() => {
    markManyReadMutation.mutate({ notificationIds: selectedIds });
    clearSelection();
  }, [clearSelection, markManyReadMutation, selectedIds]);

  if (hasFilters && !notifications.length) {
    return <NoResults />;
  }

  if (!notifications.length) {
    return <EmptyState onlyUnread={listInput.onlyUnread} />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientAction
          isSubmitting={markManyReadMutation.isPending}
          onClick={handleMarkSelectedRead}
        >
          Mark read
        </BulkClientAction>
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
