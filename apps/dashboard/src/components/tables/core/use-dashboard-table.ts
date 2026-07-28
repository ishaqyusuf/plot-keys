"use client";

import {
  type ColumnOrderState,
  type ColumnSizingState,
  getCoreRowModel,
  type RowSelectionState,
  type TableOptions,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

type UseDashboardTableProps<TData extends { id: string }> = Pick<
  TableOptions<TData>,
  "columns" | "data" | "meta"
> & {
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  setColumnOrder: (updater: Updater<ColumnOrderState>) => void;
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
};

export function useDashboardTable<TData extends { id: string }>({
  columnOrder,
  columns,
  columnSizing,
  columnVisibility,
  data,
  meta,
  rowSelection,
  setColumnOrder,
  setColumnSizing,
  setColumnVisibility,
  setRowSelection,
}: UseDashboardTableProps<TData>) {
  return useReactTable({
    data,
    getRowId: (row) => row.id,
    columns,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    meta,
    onColumnVisibilityChange: setColumnVisibility,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      rowSelection,
    },
  });
}
