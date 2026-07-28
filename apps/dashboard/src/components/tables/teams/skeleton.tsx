"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function TeamsSkeleton() {
  return (
    <TableSkeleton
      columns={columns({ canManage: true, currentUserId: "" })}
      rowCount={25}
      stickyColumnIds={["select", "member"]}
      actionsColumnId="actions"
    />
  );
}
