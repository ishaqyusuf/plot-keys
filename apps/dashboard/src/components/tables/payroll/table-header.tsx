"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "entry",
    label: "Employee",
    sortField: "employee",
  },
  tableId: "payroll",
});
