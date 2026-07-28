"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function NotificationsSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "notification"]}
      actionsColumnId="actions"
    />
  );
}
