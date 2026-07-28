"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "notification",
    label: "Notification",
    sortField: "title",
  },
  tableId: "notifications",
});
