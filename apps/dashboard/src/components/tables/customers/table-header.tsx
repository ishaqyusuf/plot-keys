"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "name",
    label: "Name",
    sortField: "name",
  },
  tableId: "customers",
});
