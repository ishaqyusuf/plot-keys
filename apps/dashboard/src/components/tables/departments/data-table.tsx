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
  resolveDepartmentsListInput,
  useDepartmentsFilterParams,
} from "@/hooks/use-departments-filter-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useDepartmentsStore } from "@/store/departments";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { columns, type DepartmentTableRow } from "./columns";
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
  const { rowSelection, setColumns, setRowSelection } = useDepartmentsStore();
  const { filter, hasFilters } = useDepartmentsFilterParams();
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
    tableId: "departments",
  });
  const listInput = resolveDepartmentsListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.departments.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: departments } = useMemo(
    () => getDashboardInfiniteListState<DepartmentTableRow>(data.pages),
    [data.pages],
  );
  const invalidateDepartments = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.departments.list.infiniteQueryKey(),
    });
  }, [queryClient, trpc]);
  const deleteDepartmentsMutation = useMutation(
    trpc.departments.deleteMany.mutationOptions({
      onSuccess: invalidateDepartments,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: departments,
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
    tableId: "departments",
  });
  const handleBulkDeleteDepartments = useCallback(() => {
    deleteDepartmentsMutation.mutate({ departmentIds: selectedIds });
    clearSelection();
  }, [deleteDepartmentsMutation, selectedIds, clearSelection]);

  if (hasFilters && !departments.length) {
    return <NoResults />;
  }

  if (!departments.length) {
    return <EmptyState />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientDeleteAction
          count={selectedCount}
          disabled={deleteDepartmentsMutation.isPending}
          label="departments"
          onConfirm={handleBulkDeleteDepartments}
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
