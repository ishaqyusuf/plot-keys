import type { Column, RowSelectionState, Updater } from "@tanstack/react-table";
import { create } from "zustand";

interface AppointmentsState {
  columns: Column<any, unknown>[];
  rowSelection: RowSelectionState;
  setColumns: (columns?: Column<any, unknown>[]) => void;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
}

export const useAppointmentsStore = create<AppointmentsState>()((set) => ({
  columns: [],
  rowSelection: {},
  setColumns: (columns) => set({ columns: columns || [] }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === "function" ? updater(state.rowSelection) : updater,
    })),
}));
