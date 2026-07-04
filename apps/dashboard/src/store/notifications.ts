import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface NotificationsState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
