"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "property",
    label: "Listing",
    sortField: "title",
  },
  tableId: "properties",
});
