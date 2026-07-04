"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import { Table, TableBody, TableCell, TableRow } from "@plotkeys/ui/table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { VirtualRow } from "@/components/tables/core";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useStickyColumns } from "@/hooks/use-sticky-columns";
import { useTableDnd } from "@/hooks/use-table-dnd";
import { useTableScroll } from "@/hooks/use-table-scroll";
import { useTableSettings } from "@/hooks/use-table-settings";
import { usePropertiesStore } from "@/store/properties";
import { ROW_HEIGHTS, STICKY_COLUMNS } from "@/utils/table-configs";
import { getColumnIds, type TableSettings } from "@/utils/table-settings";
import { columns, type PropertyTableRow } from "./columns";
import type { PropertyTableColumnOptions } from "./columns";
import { DataTableHeader } from "./data-table-header";

const NON_CLICKABLE_COLUMNS = new Set(["actions"]);

type PropertiesDataTableProps = PropertyTableColumnOptions & {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  initialSettings?: Partial<TableSettings>;
  isFetchingNextPage: boolean;
  properties: PropertyTableRow[];
};

export function PropertiesDataTable({
  fetchNextPage,
  hasNextPage,
  initialSettings,
  isFetchingNextPage,
  properties,
  publishVariant,
  statusVariant,
  typeLabels,
}: PropertiesDataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { setColumns } = usePropertiesStore();
  const columnOptions = useMemo(
    () => ({ publishVariant, statusVariant, typeLabels }),
    [publishVariant, statusVariant, typeLabels],
  );
  const tableColumns = useMemo(() => columns(columnOptions), [columnOptions]);
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
    tableId: "properties",
  });
  const table = useReactTable({
    columnResizeMode: "onChange",
    columns: tableColumns,
    data: properties,
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
    stickyColumns: STICKY_COLUMNS.properties,
    table,
  });
  const tableScroll = useTableScroll({
    startFromColumn: STICKY_COLUMNS.properties.length,
    useColumnWidths: true,
  });
  const rows = table.getRowModel().rows;
  const rowHeight = ROW_HEIGHTS.properties;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    getScrollElement: () => parentRef.current,
    overscan: 10,
  });
  const loadMore = useCallback(() => {
    fetchNextPage();
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
    hasNextPage,
    isFetchingNextPage,
    rowCount: rows.length,
    rowVirtualizer,
    scrollRef: parentRef,
    threshold: 20,
  });

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
            id="properties-table-dnd"
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
