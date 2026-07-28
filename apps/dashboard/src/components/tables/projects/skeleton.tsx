"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function ProjectsSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "project"]}
      actionsColumnId="actions"
    />
  );
}
