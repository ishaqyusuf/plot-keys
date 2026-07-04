import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface LeadsState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useLeadsStore = create<LeadsState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
