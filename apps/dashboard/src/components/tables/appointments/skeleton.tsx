"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

export function AppointmentsSkeleton() {
  return (
    <TableSkeleton
      columns={columns}
      rowCount={25}
      stickyColumnIds={["select", "appointment"]}
      actionsColumnId="actions"
    />
  );
}
