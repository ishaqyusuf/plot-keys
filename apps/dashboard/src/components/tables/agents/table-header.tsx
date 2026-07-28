"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "agent",
    label: "Agent",
    sortField: "name",
  },
  tableId: "agents",
});
