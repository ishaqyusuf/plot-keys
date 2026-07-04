"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import { Table, TableBody, TableCell, TableRow } from "@plotkeys/ui/table";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import {
  type MutableRefObject,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { VirtualRow } from "@/components/tables/core";
import { useCustomersFilterParams } from "@/hooks/use-customers-filter-params";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useSortParams } from "@/hooks/use-sort-params";
import { useStickyColumns } from "@/hooks/use-sticky-columns";
import { useTableDnd } from "@/hooks/use-table-dnd";
import { useTableScroll } from "@/hooks/use-table-scroll";
import { useTableSettings } from "@/hooks/use-table-settings";
import { useCustomersStore } from "@/store/customers";
import { useTRPC } from "@/trpc/client";
import { ROW_HEIGHTS, STICKY_COLUMNS } from "@/utils/table-configs";
import { getColumnIds, type TableSettings } from "@/utils/table-settings";
import { columns } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { CustomersEmptyState, CustomersNoResults } from "./empty-states";
import { CustomersSkeleton } from "./skeleton";

const NON_CLICKABLE_COLUMNS = new Set(["actions"]);

type CustomersDataTableProps = {
  canManage: boolean;
  initialSettings?: Partial<TableSettings>;
};

export function CustomersDataTable({
  canManage,
  initialSettings,
}: CustomersDataTableProps) {
  const trpc = useTRPC();
  const parentRef = useRef<HTMLDivElement>(null);
  const { setColumns } = useCustomersStore();
  const {
    filters,
    hasFilters,
    isPending: isFilterPending,
    setFilters,
  } = useCustomersFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const tableColumns = useMemo(() => columns(canManage), [canManage]);
  const columnIds = useMemo(() => getColumnIds(tableColumns), [tableColumns]);
  const {
    columnVisibility,
    setColumnVisibility,
    columnSizing,
    setColumnSizing,
    columnOrder,
    setColumnOrder,
  } = useTableSettings({
    columnIds,
    initialSettings,
    tableId: "customers",
  });
  const infiniteQueryOptions = trpc.customers.get.infiniteQueryOptions(
    {
      ...filters,
      q: deferredSearch,
      sort: params.sort,
    },
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const tableData = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const table = useReactTable({
    columnResizeMode: "onChange",
    columns: tableColumns,
    data: tableData,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
    },
  });
  useEffect(() => {
    setColumns(table.getAllLeafColumns());
  }, [table, setColumns, columnVisibility]);

  const { sensors, handleDragEnd } = useTableDnd(table);
  const { getStickyStyle, getStickyClassName } = useStickyColumns({
    columnVisibility,
    stickyColumns: STICKY_COLUMNS.customers,
    table,
  });
  const tableScroll = useTableScroll({
    startFromColumn: STICKY_COLUMNS.customers.length,
    useColumnWidths: true,
  });
  const rows = table.getRowModel().rows;
  const rowHeight = ROW_HEIGHTS.customers;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    getScrollElement: () => parentRef.current,
    overscan: 10,
  });
  const loadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const setScrollContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      parentRef.current = element;
      (
        tableScroll.containerRef as MutableRefObject<HTMLDivElement | null>
      ).current = element;
    },
    [tableScroll.containerRef],
  );

  useInfiniteScroll<HTMLDivElement>({
    fetchNextPage: loadMore,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    rowCount: rows.length,
    rowVirtualizer,
    scrollRef: parentRef,
    threshold: 20,
  });

  if (isFilterPending) {
    return <CustomersSkeleton />;
  }

  if (hasFilters && !tableData.length) {
    return <CustomersNoResults onClear={() => setFilters(null)} />;
  }

  if (!tableData.length) {
    return <CustomersEmptyState canManage={canManage} />;
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="relative">
      <div className="w-full">
        <div
          className="overflow-auto overscroll-contain border-border border-x border-b scrollbar-hide"
          ref={setScrollContainerRef}
          style={{
            height: "calc(100vh - 350px + var(--header-offset, 0px))",
          }}
        >
          <DndContext
            collisionDetection={closestCenter}
            id="customers-table-dnd"
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table className="min-w-full">
              <DataTableHeader table={table} tableScroll={tableScroll} />
              <TableBody
                className="block border-x-0"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: "relative",
                }}
              >
                {virtualItems.length > 0 ? (
                  virtualItems.map((virtualRow: VirtualItem) => {
                    const row = rows[virtualRow.index];

                    if (!row) {
                      return null;
                    }

                    return (
                      <VirtualRow
                        columnOrder={columnOrder}
                        columnSizing={columnSizing}
                        columnVisibility={columnVisibility}
                        getStickyClassName={getStickyClassName}
                        getStickyStyle={getStickyStyle}
                        key={row.id}
                        nonClickableColumns={NON_CLICKABLE_COLUMNS}
                        row={row}
                        rowHeight={rowHeight}
                        virtualStart={virtualRow.start}
                      />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      className="h-24 text-center"
                      colSpan={tableColumns.length}
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
          <div
            aria-hidden
            style={{ flexShrink: 0, height: "var(--header-offset, 0px)" }}
          />
        </div>
      </div>
    </div>
  );
}
