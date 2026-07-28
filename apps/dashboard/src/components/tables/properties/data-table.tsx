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
  resolvePropertyListInput,
  usePropertyFilterParams,
} from "@/hooks/use-property-filter-params";
import { usePropertyParams } from "@/hooks/use-property-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { usePropertiesStore } from "@/store/properties";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import type { PropertyTableColumnOptions } from "./columns";
import { columns, type PropertyTableRow } from "./columns";
import { EmptyState, NoResults } from "./empty-states";
import { DataTableHeader } from "./table-header";

const statusVariant: PropertyTableColumnOptions["statusVariant"] = {
  active: "default",
  off_market: "outline",
  rented: "secondary",
  sold: "outline",
};

const publishVariant: PropertyTableColumnOptions["publishVariant"] = {
  archived: "secondary",
  draft: "outline",
  published: "default",
};

const typeLabels: PropertyTableColumnOptions["typeLabels"] = {
  commercial: "Commercial",
  industrial: "Industrial",
  land: "Land",
  mixed_use: "Mixed use",
  residential: "Home",
};

type Props = {
  initialSettings?: Partial<TableSettings>;
};

export function DataTable({ initialSettings }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  useScrollHeader(parentRef);
  const { setParams: setPropertyParams } = usePropertyParams();
  const { rowSelection, setColumns, setRowSelection } = usePropertiesStore();
  const { filter, hasFilters } = usePropertyFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filter.q);
  const columnOptions = useMemo(
    () => ({ publishVariant, statusVariant, typeLabels }),
    [],
  );
  const tableColumns = useMemo(() => columns(columnOptions), [columnOptions]);
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
    tableId: "properties",
  });
  const listInput = resolvePropertyListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.properties.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: tableData } = useMemo(
    () => getDashboardInfiniteListState<PropertyTableRow>(data.pages),
    [data.pages],
  );
  const invalidateProperties = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.properties.list.infiniteQueryKey(),
    });
  }, [queryClient, trpc]);
  const deletePropertiesMutation = useMutation(
    trpc.properties.deleteMany.mutationOptions({
      onSuccess: invalidateProperties,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns: tableColumns,
    columnSizing,
    columnVisibility,
    data: tableData,
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
    tableId: "properties",
  });
  const handleCellClick = useCallback(
    (rowId: string) => {
      setPropertyParams({ details: true, propertyId: rowId });
    },
    [setPropertyParams],
  );
  const handleBulkDeleteProperties = useCallback(() => {
    deletePropertiesMutation.mutate({ propertyIds: selectedIds });
    clearSelection();
  }, [deletePropertiesMutation, selectedIds, clearSelection]);

  if (hasFilters && !tableData.length) {
    return <NoResults />;
  }

  if (!tableData.length) {
    return <EmptyState />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientDeleteAction
          count={selectedCount}
          disabled={deletePropertiesMutation.isPending}
          label="properties"
          onConfirm={handleBulkDeleteProperties}
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
