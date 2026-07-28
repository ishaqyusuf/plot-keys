"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "request",
    label: "Employee",
    sortField: "employee",
  },
  tableId: "leave-requests",
});
