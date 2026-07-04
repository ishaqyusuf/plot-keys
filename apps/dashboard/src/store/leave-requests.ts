import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface LeaveRequestsState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useLeaveRequestsStore = create<LeaveRequestsState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
