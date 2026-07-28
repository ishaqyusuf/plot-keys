"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo, useRef } from "react";
import type { LeadStatus } from "@/components/leads/lead-utils";
import {
  BulkClientAction,
  CoreDataTableContent,
  CoreDataTableShell,
  useDashboardTable,
  useDashboardTableRuntime,
  useDashboardTableSettings,
} from "@/components/tables/core";
import {
  resolveLeadListInput,
  useLeadFilterParams,
} from "@/hooks/use-lead-filter-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useLeadsStore } from "@/store/leads";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { columns, type LeadTableRow } from "./columns";
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
  const { rowSelection, setColumns, setRowSelection } = useLeadsStore();
  const { filter, hasFilters } = useLeadFilterParams();
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
    tableId: "leads",
  });
  const listInput = resolveLeadListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.leads.list.infiniteQueryOptions(listInput, {
    getNextPageParam: ({ meta }) => meta?.cursor,
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: leads } = useMemo(
    () => getDashboardInfiniteListState<LeadTableRow>(data.pages),
    [data.pages],
  );
  const invalidateLeads = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.leads.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.leads.stats.queryKey(),
      }),
    ]);
  }, [queryClient, trpc]);
  const updateLeadsStatusMutation = useMutation(
    trpc.leads.updateManyStatus.mutationOptions({
      onSuccess: invalidateLeads,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: leads,
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
      tableId: "leads",
    });
  const handleBulkStatusUpdate = useCallback(
    (status: LeadStatus) => {
      updateLeadsStatusMutation.mutate({ leadIds: selectedIds, status });
      clearSelection();
    },
    [clearSelection, selectedIds, updateLeadsStatusMutation],
  );

  if (hasFilters && !leads.length) {
    return <NoResults />;
  }

  if (!leads.length) {
    return <EmptyState activeStatus={listInput.status} />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <>
          <BulkClientAction
            isSubmitting={updateLeadsStatusMutation.isPending}
            onClick={() => handleBulkStatusUpdate("contacted")}
          >
            Mark contacted
          </BulkClientAction>
          <BulkClientAction
            isSubmitting={updateLeadsStatusMutation.isPending}
            onClick={() => handleBulkStatusUpdate("qualified")}
          >
            Qualify
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
