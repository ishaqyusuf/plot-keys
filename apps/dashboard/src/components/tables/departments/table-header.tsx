"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "department",
    label: "Department",
    sortField: "name",
  },
  tableId: "departments",
});
