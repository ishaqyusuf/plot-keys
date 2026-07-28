"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "../../../utils";
import { Checkbox } from "../../checkbox";

export const cells = {
  selectColumn<TData>(): ColumnDef<TData> {
    return {
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          className="translate-y-px"
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
          onClick={(event) => event.stopPropagation()}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="translate-y-px"
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(Boolean(checked))
          }
        />
      ),
      id: "select",
      meta: {
        className: cn(
          "w-10 min-w-10 max-w-10 px-4 md:sticky md:left-0 md:z-30 md:bg-background",
        ),
      },
      size: 40,
    };
  },
};
