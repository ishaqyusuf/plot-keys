"use client";

import type { RowSelectionState, Updater } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

type UseTableRowSelectionProps = {
  rowSelection: RowSelectionState;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
};

export function useTableRowSelection({
  rowSelection,
  setRowSelection,
}: UseTableRowSelectionProps) {
  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);
  const selectedCount = selectedIds.length;
  const clearSelection = useCallback(() => {
    setRowSelection({});
  }, [setRowSelection]);

  return {
    clearSelection,
    selectedCount,
    selectedIds,
  };
}
