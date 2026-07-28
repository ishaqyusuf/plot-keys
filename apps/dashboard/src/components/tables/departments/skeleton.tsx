"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function DepartmentsSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "department"]}
      actionsColumnId="actions"
    />
  );
}
