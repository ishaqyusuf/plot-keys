"use client";

import type { Table, VisibilityState } from "@tanstack/react-table";
import { useStickyColumns } from "@/hooks/use-sticky-columns";
import { useTableDnd } from "@/hooks/use-table-dnd";
import { useTableScroll } from "@/hooks/use-table-scroll";
import { STICKY_COLUMNS } from "@/utils/table-configs";
import type { TableId } from "@/utils/table-settings";
import type { StickyColumnConfig } from "./types";

type UseTableColumnRuntimeProps<TData> = {
  columnVisibility: VisibilityState;
  stickyColumns?: StickyColumnConfig[];
  table: Table<TData>;
  tableId: TableId;
};

export function useTableColumnRuntime<TData>({
  columnVisibility,
  stickyColumns,
  table,
  tableId,
}: UseTableColumnRuntimeProps<TData>) {
  const resolvedStickyColumns = stickyColumns ?? STICKY_COLUMNS[tableId];
  const { sensors, handleDragEnd } = useTableDnd(table);
  const { getStickyStyle, getStickyClassName } = useStickyColumns({
    columnVisibility,
    stickyColumns: resolvedStickyColumns,
    table,
  });
  const tableScroll = useTableScroll({
    startFromColumn: resolvedStickyColumns.length,
    useColumnWidths: true,
  });

  return {
    getStickyClassName,
    getStickyStyle,
    handleDragEnd,
    sensors,
    tableScroll,
  };
}
