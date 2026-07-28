"use client";

import { createCoreDataTableHeader } from "@/components/tables/core";

export const DataTableHeader = createCoreDataTableHeader({
  primaryColumn: {
    id: "post",
    label: "Post",
    sortField: "title",
  },
  tableId: "blog",
});
