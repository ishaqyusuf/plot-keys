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
import { DashboardTablePageBody } from "@/components/dashboard/dashboard-page";
import { VirtualRow } from "@/components/tables/core";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useStickyColumns } from "@/hooks/use-sticky-columns";
import { useTableDnd } from "@/hooks/use-table-dnd";
import { useTableScroll } from "@/hooks/use-table-scroll";
import { useTableSettings } from "@/hooks/use-table-settings";
import { useLeaveRequestsStore } from "@/store/leave-requests";
import { ROW_HEIGHTS, STICKY_COLUMNS } from "@/utils/table-configs";
import { getColumnIds, type TableSettings } from "@/utils/table-settings";
import { columns, type LeaveRequestTableRow } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { LeaveRequestsTableHeader } from "./table-header";

const NON_CLICKABLE_COLUMNS = new Set(["actions"]);

type LeaveRequestsDataTableProps = {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  initialSettings?: Partial<TableSettings>;
  isFetchingNextPage: boolean;
  requestCount: number;
  requests: LeaveRequestTableRow[];
};

export function LeaveRequestsDataTable({
  fetchNextPage,
  hasNextPage,
  initialSettings,
  isFetchingNextPage,
  requestCount,
  requests,
}: LeaveRequestsDataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { setColumns } = useLeaveRequestsStore();
  const columnIds = useMemo(() => getColumnIds(columns), []);
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
    tableId: "leave-requests",
  });
  const table = useReactTable({
    columnResizeMode: "onChange",
    columns,
    data: requests,
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
    stickyColumns: STICKY_COLUMNS["leave-requests"],
    table,
  });
  const tableScroll = useTableScroll({
    startFromColumn: STICKY_COLUMNS["leave-requests"].length,
    useColumnWidths: true,
  });
  const rows = table.getRowModel().rows;
  const rowHeight = ROW_HEIGHTS["leave-requests"];
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
    <>
      <LeaveRequestsTableHeader requestCount={requestCount} />
      <DashboardTablePageBody>
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
                id="leave-requests-table-dnd"
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
                          colSpan={columns.length}
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
      </DashboardTablePageBody>
    </>
  );
}
