"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "employee",
    label: "Employee",
    sortField: "name",
  },
  tableId: "employees",
});
