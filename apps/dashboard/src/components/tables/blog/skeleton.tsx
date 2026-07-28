"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function BlogSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "post"]}
      actionsColumnId="actions"
    />
  );
}
