"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo, useRef } from "react";
import {
  BulkClientDeleteAction,
  CoreDataTableContent,
  CoreDataTableShell,
  useDashboardTable,
  useDashboardTableRuntime,
  useDashboardTableSettings,
} from "@/components/tables/core";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import {
  resolveTeamListInput,
  useTeamFilterParams,
} from "@/hooks/use-team-filter-params";
import { useTeamMembersStore } from "@/store/team-members";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { columns, type TeamMemberRow } from "./columns";
import { EmptyState, NoResults } from "./empty-states";
import { DataTableHeader } from "./table-header";

type Props = {
  canManage: boolean;
  currentUserId: string;
  initialSettings?: Partial<TableSettings>;
};

export function DataTable({
  canManage,
  currentUserId,
  initialSettings,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  useScrollHeader(parentRef);
  const { rowSelection, setColumns, setRowSelection } = useTeamMembersStore();
  const { filter, hasFilters } = useTeamFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filter.q);
  const tableColumns = useMemo(
    () => columns({ canManage, currentUserId }),
    [canManage, currentUserId],
  );
  const {
    columnVisibility,
    setColumnVisibility,
    columnSizing,
    setColumnSizing,
    columnOrder,
    setColumnOrder,
  } = useDashboardTableSettings({
    columns: tableColumns,
    initialSettings,
    tableId: "team",
  });
  const listInput = resolveTeamListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.team.listMembers.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: members } = useMemo(
    () => getDashboardInfiniteListState<TeamMemberRow>(data.pages),
    [data.pages],
  );
  const invalidateMembers = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.team.listMembers.infiniteQueryKey(),
    });
  }, [queryClient, trpc]);
  const removeMembersMutation = useMutation(
    trpc.team.removeMembers.mutationOptions({
      onSuccess: invalidateMembers,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns: tableColumns,
    columnSizing,
    columnVisibility,
    data: members,
    rowSelection,
    setColumnOrder,
    setColumnSizing,
    setColumnVisibility,
    setRowSelection,
  });

  const {
    clearSelection,
    contentRuntime,
    selectedCount,
    selectedIds,
    shellRuntime,
  } = useDashboardTableRuntime({
    columnVisibility,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    parentRef,
    rowSelection,
    setColumns,
    setRowSelection,
    table,
    tableId: "team",
  });
  const handleBulkRemoveMembers = useCallback(() => {
    removeMembersMutation.mutate({ membershipIds: selectedIds });
    clearSelection();
  }, [removeMembersMutation, selectedIds, clearSelection]);

  if (hasFilters && !members.length) {
    return <NoResults />;
  }

  if (!members.length) {
    return <EmptyState />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientDeleteAction
          count={selectedCount}
          disabled={removeMembersMutation.isPending}
          label="members"
          onConfirm={handleBulkRemoveMembers}
        />
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
