"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function LeaveRequestsSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "request"]}
      actionsColumnId="actions"
    />
  );
}
