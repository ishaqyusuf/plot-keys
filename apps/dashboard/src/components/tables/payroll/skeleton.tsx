"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function PayrollSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "entry"]}
      actionsColumnId="actions"
    />
  );
}
