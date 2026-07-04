import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface PropertiesState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const usePropertiesStore = create<PropertiesState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
