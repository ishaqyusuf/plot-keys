"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function CustomersSkeleton() {
  return (
    <TableSkeleton
      columns={columns(true)}
      rowCount={25}
      stickyColumnIds={["select", "name"]}
      actionsColumnId="actions"
    />
  );
}
