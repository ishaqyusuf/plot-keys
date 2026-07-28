"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "lead",
    label: "Lead",
    sortField: "name",
  },
  tableId: "leads",
});
