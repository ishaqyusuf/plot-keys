"use client";

import type { Column, Table, VisibilityState } from "@tanstack/react-table";
import { useEffect } from "react";

type SetColumns = (columns?: Column<any, unknown>[]) => void;

type UseTableColumnSyncOptions<TData> = {
  columnVisibility: VisibilityState;
  setColumns: SetColumns;
  table: Table<TData>;
};

export function useTableColumnSync<TData>({
  columnVisibility,
  setColumns,
  table,
}: UseTableColumnSyncOptions<TData>) {
  useEffect(() => {
    setColumns(table.getAllLeafColumns());
  }, [table, setColumns, columnVisibility]);
}
