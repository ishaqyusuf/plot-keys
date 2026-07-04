import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface BlogState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useBlogStore = create<BlogState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
