import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface AgentsState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useAgentsStore = create<AgentsState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
