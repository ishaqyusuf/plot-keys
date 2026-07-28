"use client";

import type {
  Column,
  RowSelectionState,
  Table,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";
import type { MutableRefObject } from "react";
import { ROW_HEIGHTS } from "@/utils/table-configs";
import type { TableId } from "@/utils/table-settings";
import type { CoreDataTableContentRuntime } from "./data-table-content";
import type { CoreDataTableShellRuntime } from "./data-table-shell";
import { useTableColumnRuntime } from "./use-table-column-runtime";
import { useTableColumnSync } from "./use-table-column-sync";
import { useTableInfiniteScroll } from "./use-table-infinite-scroll";
import { useTableRowSelection } from "./use-table-row-selection";
import { useTableScrollContainerRef } from "./use-table-scroll-container-ref";
import { useTableVirtualizer } from "./use-table-virtualizer";

type SetColumns = (columns?: Column<any, unknown>[]) => void;

type UseDashboardTableRuntimeOptions<TData> = {
  columnVisibility: VisibilityState;
  fetchNextPage: () => unknown;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  infiniteScrollThreshold?: number;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  rowSelection: RowSelectionState;
  setColumns: SetColumns;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
  table: Table<TData>;
  tableId: TableId;
};

export function useDashboardTableRuntime<TData>({
  columnVisibility,
  fetchNextPage,
  hasNextPage,
  infiniteScrollThreshold,
  isFetchingNextPage,
  parentRef,
  rowSelection,
  setColumns,
  setRowSelection,
  table,
  tableId,
}: UseDashboardTableRuntimeOptions<TData>) {
  useTableColumnSync({ columnVisibility, setColumns, table });

  const {
    getStickyClassName,
    getStickyStyle,
    handleDragEnd,
    sensors,
    tableScroll,
  } = useTableColumnRuntime({
    columnVisibility,
    table,
    tableId,
  });
  const rows = table.getRowModel().rows;
  const rowHeight = ROW_HEIGHTS[tableId];
  const rowVirtualizer = useTableVirtualizer({
    rowCount: rows.length,
    rowHeight,
    scrollRef: parentRef,
  });
  const setScrollContainerRef = useTableScrollContainerRef({
    parentRef,
    tableScroll,
  });

  useTableInfiniteScroll({
    fetchNextPage,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    rowCount: rows.length,
    rowVirtualizer,
    scrollRef: parentRef,
    threshold: infiniteScrollThreshold,
  });
  const { clearSelection, selectedCount, selectedIds } = useTableRowSelection({
    rowSelection,
    setRowSelection,
  });
  const contentRuntime: CoreDataTableContentRuntime<TData> = {
    getStickyClassName,
    getStickyStyle,
    handleDragEnd,
    rows,
    rowHeight,
    rowSelection,
    rowVirtualizer,
    sensors,
    tableId,
    tableScroll,
  };
  const shellRuntime: CoreDataTableShellRuntime = {
    onDeselect: clearSelection,
    scrollRef: setScrollContainerRef,
    selectedCount,
  };

  return {
    clearSelection,
    contentRuntime,
    selectedCount,
    selectedIds,
    shellRuntime,
  };
}
