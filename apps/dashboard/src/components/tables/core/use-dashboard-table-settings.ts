"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTableSettings } from "@/hooks/use-table-settings";
import {
  getColumnIds,
  type TableId,
  type TableSettings,
} from "@/utils/table-settings";

type UseDashboardTableSettingsProps<TData> = {
  columns: ColumnDef<TData>[];
  initialSettings?: Partial<TableSettings>;
  tableId: TableId;
};

export function useDashboardTableSettings<TData>({
  columns,
  initialSettings,
  tableId,
}: UseDashboardTableSettingsProps<TData>) {
  const columnIds = useMemo(() => getColumnIds(columns), [columns]);

  return useTableSettings({
    columnIds,
    initialSettings,
    tableId,
  });
}
