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
  resolvePayrollListInput,
  usePayrollFilterParams,
} from "@/hooks/use-payroll-filter-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { usePayrollStore } from "@/store/payroll";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { columns, type PayrollEntryTableRow } from "./columns";
import { EmptyState, NoResults } from "./empty-states";
import { DataTableHeader } from "./table-header";

type Props = {
  initialSettings?: Partial<TableSettings>;
  periodMonth: number;
  periodYear: number;
};

export function DataTable({ initialSettings, periodMonth, periodYear }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  useScrollHeader(parentRef);
  const { rowSelection, setColumns, setRowSelection } = usePayrollStore();
  const { filter, hasFilters } = usePayrollFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filter.q);
  const periodInput = { periodMonth, periodYear };
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
    tableId: "payroll",
  });
  const listInput = resolvePayrollListInput(filter, params.sort, periodInput, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.payroll.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: entries } = useMemo(
    () => getDashboardInfiniteListState<PayrollEntryTableRow>(data.pages),
    [data.pages],
  );
  const invalidatePayroll = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.payroll.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.payroll.summary.queryKey(),
      }),
    ]);
  }, [queryClient, trpc]);
  const markEntriesPaidMutation = useMutation(
    trpc.payroll.markManyPaid.mutationOptions({
      onSuccess: invalidatePayroll,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: entries,
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
      tableId: "payroll",
    });
  const handleMarkSelectedPaid = useCallback(() => {
    markEntriesPaidMutation.mutate({ payrollEntryIds: selectedIds });
    clearSelection();
  }, [clearSelection, markEntriesPaidMutation, selectedIds]);

  if (hasFilters && !entries.length) {
    return <NoResults />;
  }

  if (!entries.length) {
    return <EmptyState periodMonth={periodMonth} periodYear={periodYear} />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientAction
          isSubmitting={markEntriesPaidMutation.isPending}
          onClick={handleMarkSelectedPaid}
        >
          Mark paid
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
