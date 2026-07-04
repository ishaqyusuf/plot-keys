import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface PayrollState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const usePayrollStore = create<PayrollState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
