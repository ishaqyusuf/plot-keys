"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "appointment",
    label: "Visitor",
    sortField: "name",
  },
  tableId: "appointments",
});
