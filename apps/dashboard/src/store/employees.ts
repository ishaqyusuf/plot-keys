import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface EmployeesState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useEmployeesStore = create<EmployeesState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
