import type { Column } from "@tanstack/react-table";
import { create } from "zustand";

interface TeamMembersState {
  columns: Column<any, unknown>[];
  setColumns: (columns?: Column<any, unknown>[]) => void;
}

export const useTeamMembersStore = create<TeamMembersState>()((set) => ({
  columns: [],
  setColumns: (columns) => set({ columns: columns || [] }),
}));
