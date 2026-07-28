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
import {
  resolveAgentListInput,
  useAgentFilterParams,
} from "@/hooks/use-agent-filter-params";
import { useAgentParams } from "@/hooks/use-agent-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useAgentsStore } from "@/store/agents";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { type AgentTableRow, columns } from "./columns";
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
  const { setParams: setAgentParams } = useAgentParams();
  const { rowSelection, setColumns, setRowSelection } = useAgentsStore();
  const { filter, hasFilters } = useAgentFilterParams();
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
    tableId: "agents",
  });
  const listInput = resolveAgentListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.agents.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: agents } = useMemo(
    () => getDashboardInfiniteListState<AgentTableRow>(data.pages),
    [data.pages],
  );
  const invalidateAgents = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.agents.list.infiniteQueryKey(),
    });
  }, [queryClient, trpc]);
  const deleteAgentsMutation = useMutation(
    trpc.agents.deleteMany.mutationOptions({
      onSuccess: invalidateAgents,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: agents,
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
    tableId: "agents",
  });
  const handleCellClick = useCallback(
    (rowId: string) => {
      setAgentParams({ agentId: rowId });
    },
    [setAgentParams],
  );
  const handleBulkDeleteAgents = useCallback(() => {
    deleteAgentsMutation.mutate({ agentIds: selectedIds });
    clearSelection();
  }, [deleteAgentsMutation, selectedIds, clearSelection]);

  if (hasFilters && !agents.length) {
    return <NoResults />;
  }

  if (!agents.length) {
    return <EmptyState />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientDeleteAction
          count={selectedCount}
          disabled={deleteAgentsMutation.isPending}
          label="agents"
          onConfirm={handleBulkDeleteAgents}
        />
      }
      runtime={shellRuntime}
    >
      <CoreDataTableContent
        table={table}
        header={DataTableHeader}
        onCellClick={handleCellClick}
        runtime={contentRuntime}
      />
    </CoreDataTableShell>
  );
}
