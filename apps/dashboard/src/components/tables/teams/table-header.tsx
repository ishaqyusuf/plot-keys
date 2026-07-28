"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "member",
    label: "Member",
    sortField: "name",
  },
  tableId: "team",
});
