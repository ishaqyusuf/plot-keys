"use client";

import type { ColumnSizingState, VisibilityState } from "@tanstack/react-table";
import { TableSkeleton } from "@/components/tables/core";
import { columns } from "./columns";

type PropertiesSkeletonProps = {
  columnVisibility?: VisibilityState;
  columnSizing?: ColumnSizingState;
  columnOrder?: string[];
  isEmpty?: boolean;
};

const skeletonColumnOptions = {
  publishVariant: {},
  statusVariant: {},
  typeLabels: {},
};

export function PropertiesSkeleton({
  columnVisibility = {},
  columnSizing = {},
  columnOrder = [],
  isEmpty = false,
}: PropertiesSkeletonProps) {
  return (
    <TableSkeleton
      actionsColumnId="actions"
      columnOrder={columnOrder}
      columnSizing={columnSizing}
      columnVisibility={columnVisibility}
      columns={columns(skeletonColumnOptions)}
      isEmpty={isEmpty}
      rowCount={12}
      stickyColumnIds={["property"]}
    />
  );
}
