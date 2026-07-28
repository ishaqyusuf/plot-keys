"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function AgentsSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "agent"]}
      actionsColumnId="actions"
    />
  );
}
