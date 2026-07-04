import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface DepartmentsState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useDepartmentsStore = create<DepartmentsState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
