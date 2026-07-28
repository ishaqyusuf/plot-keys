"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function EmployeesSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "employee"]}
      actionsColumnId="actions"
    />
  );
}
