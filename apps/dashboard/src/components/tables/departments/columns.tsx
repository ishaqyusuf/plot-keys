"use client";

import type { AppRouter } from "@plotkeys/api/router";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type DepartmentTableRow =
  RouterOutputs["departments"]["list"]["data"][number];

function DepartmentCell({ department }: { department: DepartmentTableRow }) {
  const employeeCount = department._count.employees;

  return (
    <div className="min-w-0 space-y-1">
      <p className="truncate text-sm font-medium text-foreground">
        {department.name}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {employeeCount} employee{employeeCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function DescriptionCell({ department }: { department: DepartmentTableRow }) {
  return (
    <p className="line-clamp-2 max-w-[360px] text-sm text-muted-foreground">
      {department.description ?? "No description"}
    </p>
  );
}

function ActionsCell({ department }: { department: DepartmentTableRow }) {
  return <ActionsMenu row={department} />;
}

export const columns: ColumnDef<DepartmentTableRow>[] = [
  createSelectColumn<DepartmentTableRow>(),
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <DepartmentCell department={row.original} />,
    header: "Department",
    id: "department",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Department",
      skeleton: { type: "text", width: "w-44" },
      sticky: true,
    },
    size: 300,
  },
  {
    cell: ({ row }) => <DescriptionCell department={row.original} />,
    header: "Description",
    id: "description",
    meta: {
      className: "min-w-[280px]",
      headerLabel: "Description",
      skeleton: { type: "text", width: "w-48" },
    },
    size: 360,
  },
  {
    cell: ({ row }) => <ActionsCell department={row.original} />,
    header: "Actions",
    id: "actions",
    meta: {
      className:
        "min-w-[80px] md:sticky md:right-0 bg-background group-hover:bg-muted z-30 justify-center !border-l !border-border",
      headerLabel: "Actions",
      skeleton: { type: "icon" },
      sticky: true,
    },
    size: 80,
  },
];
