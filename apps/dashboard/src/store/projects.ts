import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface ProjectsState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useProjectsStore = create<ProjectsState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
