"use client";

import { Checkbox } from "@plotkeys/ui/checkbox";
import type { ColumnDef, Table } from "@tanstack/react-table";

export const SELECT_COLUMN_WIDTH = 50;

export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => {
          if (checked === "indeterminate") {
            row.toggleSelected();
          } else {
            row.toggleSelected(checked);
          }
        }}
      />
    ),
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    id: "select",
    maxSize: SELECT_COLUMN_WIDTH,
    meta: {
      className:
        "w-[50px] min-w-[50px] md:sticky md:left-0 bg-background group-hover:bg-muted z-20",
      skeleton: { type: "checkbox" },
      sticky: true,
    },
    minSize: SELECT_COLUMN_WIDTH,
    size: SELECT_COLUMN_WIDTH,
  };
}

type Props<TData> = {
  table: Table<TData>;
};

export function SelectColumnHeader<TData>({ table }: Props<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  );
}
