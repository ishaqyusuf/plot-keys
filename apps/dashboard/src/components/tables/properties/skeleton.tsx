"use client";

import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

const skeletonColumnOptions = {
  publishVariant: {},
  statusVariant: {},
  typeLabels: {},
};

export function PropertiesSkeleton() {
  return (
    <TableSkeleton
      columns={columns(skeletonColumnOptions)}
      rowCount={25}
      stickyColumnIds={["select", "property"]}
      actionsColumnId="actions"
    />
  );
}
