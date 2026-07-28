"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo, useRef } from "react";
import type { CustomerStatus } from "@/components/customer/types";
import {
  BulkClientDeleteAction,
  CoreDataTableContent,
  CoreDataTableShell,
  useDashboardTable,
  useDashboardTableRuntime,
  useDashboardTableSettings,
} from "@/components/tables/core";
import {
  resolveCustomerListInput,
  useCustomerFilterParams,
} from "@/hooks/use-customer-filter-params";
import { useCustomerParams } from "@/hooks/use-customer-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useCustomersStore } from "@/store/customers";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import { SUMMARY_GRID_HEIGHTS } from "@/utils/table-configs";
import type { TableSettings } from "@/utils/table-settings";
import { columns } from "./columns";
import { EmptyState, NoResults } from "./empty-states";
import { DataTableHeader } from "./table-header";

type Props = {
  canManage: boolean;
  initialSettings?: Partial<TableSettings>;
};

export function DataTable({ canManage, initialSettings }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  const { setParams: setCustomerParams } = useCustomerParams();
  const { rowSelection, setColumns, setRowSelection } = useCustomersStore();
  const { filter, hasFilters } = useCustomerFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filter.q);
  const tableColumns = useMemo(() => columns(canManage), [canManage]);
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
    tableId: "customers",
  });
  const listInput = resolveCustomerListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.customers.get.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: tableData } = useMemo(
    () => getDashboardInfiniteListState(data.pages),
    [data.pages],
  );
  const invalidateCustomers = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.customers.get.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.customers.getById.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.customers.stats.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.filters.customers.queryKey(),
      }),
    ]);
  }, [queryClient, trpc]);
  const updateCustomerMutation = useMutation(
    trpc.customers.update.mutationOptions({
      onSuccess: invalidateCustomers,
    }),
  );
  const deleteCustomerMutation = useMutation(
    trpc.customers.delete.mutationOptions({
      onSuccess: invalidateCustomers,
    }),
  );
  const handleUpdateCustomerStatus = useCallback(
    (customerId: string, status: CustomerStatus) => {
      updateCustomerMutation.mutate({ customerId, status });
    },
    [updateCustomerMutation],
  );
  const handleDeleteCustomer = useCallback(
    (customerId: string) => {
      deleteCustomerMutation.mutate({ customerId });
    },
    [deleteCustomerMutation],
  );
  const tableMeta = useMemo(
    () => ({
      deleteCustomer: handleDeleteCustomer,
      isDeletingCustomer: deleteCustomerMutation.isPending,
      isUpdatingCustomer: updateCustomerMutation.isPending,
      updateCustomerStatus: handleUpdateCustomerStatus,
    }),
    [
      deleteCustomerMutation.isPending,
      handleDeleteCustomer,
      handleUpdateCustomerStatus,
      updateCustomerMutation.isPending,
    ],
  );
  const table = useDashboardTable({
    columnOrder,
    columns: tableColumns,
    columnSizing,
    columnVisibility,
    data: tableData,
    meta: tableMeta,
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
    infiniteScrollThreshold: 50,
    isFetchingNextPage,
    parentRef,
    rowSelection,
    setColumns,
    setRowSelection,
    table,
    tableId: "customers",
  });
  const handleCellClick = useCallback(
    (rowId: string) => {
      setCustomerParams({ customerId: rowId, details: true });
    },
    [setCustomerParams],
  );
  const handleBulkDeleteCustomers = useCallback(() => {
    for (const customerId of selectedIds) {
      deleteCustomerMutation.mutate({ customerId });
    }
    clearSelection();
  }, [deleteCustomerMutation, selectedIds, clearSelection]);
  useScrollHeader(parentRef, { extraOffset: SUMMARY_GRID_HEIGHTS.customers });

  if (hasFilters && !tableData.length) {
    return <NoResults />;
  }

  if (!tableData.length) {
    return <EmptyState canManage={canManage} />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientDeleteAction
          count={selectedCount}
          disabled={deleteCustomerMutation.isPending}
          label="customers"
          onConfirm={handleBulkDeleteCustomers}
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
