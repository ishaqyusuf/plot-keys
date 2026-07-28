"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "project",
    label: "Project",
    sortField: "name",
  },
  tableId: "projects",
});
