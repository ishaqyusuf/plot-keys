import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface AppointmentsState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useAppointmentsStore = create<AppointmentsState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
