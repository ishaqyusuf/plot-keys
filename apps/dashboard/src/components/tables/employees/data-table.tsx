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
  resolveEmployeesListInput,
  useEmployeesFilterParams,
} from "@/hooks/use-employees-filter-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useEmployeesStore } from "@/store/employees";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { columns, type EmployeeTableRow } from "./columns";
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
  const { rowSelection, setColumns, setRowSelection } = useEmployeesStore();
  const { filter, hasFilters } = useEmployeesFilterParams();
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
    tableId: "employees",
  });
  const listInput = resolveEmployeesListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.employees.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: employees } = useMemo(
    () => getDashboardInfiniteListState<EmployeeTableRow>(data.pages),
    [data.pages],
  );
  const invalidateEmployees = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.employees.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.employees.stats.queryKey(),
      }),
    ]);
  }, [queryClient, trpc]);
  const deleteEmployeesMutation = useMutation(
    trpc.employees.deleteMany.mutationOptions({
      onSuccess: invalidateEmployees,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: employees,
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
    tableId: "employees",
  });
  const handleBulkDeleteEmployees = useCallback(() => {
    deleteEmployeesMutation.mutate({ employeeIds: selectedIds });
    clearSelection();
  }, [deleteEmployeesMutation, selectedIds, clearSelection]);

  if (hasFilters && !employees.length) {
    return <NoResults />;
  }

  if (!employees.length) {
    return (
      <EmptyState
        activeStatus={listInput.status}
        departmentId={listInput.departmentId}
      />
    );
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientDeleteAction
          count={selectedCount}
          disabled={deleteEmployeesMutation.isPending}
          label="employees"
          onConfirm={handleBulkDeleteEmployees}
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
