"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function LeadsSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "lead"]}
      actionsColumnId="actions"
    />
  );
}
