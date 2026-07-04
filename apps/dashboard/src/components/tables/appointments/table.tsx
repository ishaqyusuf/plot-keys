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
import { useAppointmentsStore } from "@/store/appointments";
import { ROW_HEIGHTS, STICKY_COLUMNS } from "@/utils/table-configs";
import { getColumnIds, type TableSettings } from "@/utils/table-settings";
import { columns, type AppointmentTableRow } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { AppointmentsTableHeader } from "./table-header";

const NON_CLICKABLE_COLUMNS = new Set(["actions"]);

type AppointmentsDataTableProps = {
  appointments: AppointmentTableRow[];
  appointmentCount: number;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  initialSettings?: Partial<TableSettings>;
  isFetchingNextPage: boolean;
};

export function AppointmentsDataTable({
  appointments,
  appointmentCount,
  fetchNextPage,
  hasNextPage,
  initialSettings,
  isFetchingNextPage,
}: AppointmentsDataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { setColumns } = useAppointmentsStore();
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
    tableId: "appointments",
  });
  const table = useReactTable({
    columnResizeMode: "onChange",
    columns,
    data: appointments,
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
    stickyColumns: STICKY_COLUMNS.appointments,
    table,
  });
  const tableScroll = useTableScroll({
    startFromColumn: STICKY_COLUMNS.appointments.length,
    useColumnWidths: true,
  });
  const rows = table.getRowModel().rows;
  const rowHeight = ROW_HEIGHTS.appointments;
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
      <AppointmentsTableHeader appointmentCount={appointmentCount} />
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
                id="appointments-table-dnd"
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
