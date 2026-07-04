"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { deleteDepartmentAction } from "@/app/actions";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type DepartmentTableRow =
  RouterOutputs["workspace"]["listDepartments"]["data"][number];

function DepartmentCell({
  department,
}: {
  department: DepartmentTableRow;
}) {
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

function DescriptionCell({
  department,
}: {
  department: DepartmentTableRow;
}) {
  return (
    <p className="line-clamp-2 max-w-[360px] text-sm text-muted-foreground">
      {department.description ?? "No description"}
    </p>
  );
}

function ActionsCell({ department }: { department: DepartmentTableRow }) {
  return (
    <div
      className="flex flex-wrap justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Button asChild size="sm" variant="outline">
        <Link href={`/hr/employees?department=${department.id}`}>
          View employees
        </Link>
      </Button>
      <form action={deleteDepartmentAction}>
        <input name="departmentId" type="hidden" value={department.id} />
        <Button
          className="text-destructive hover:text-destructive"
          size="sm"
          type="submit"
          variant="ghost"
        >
          Delete
        </Button>
      </form>
    </div>
  );
}

export const columns: ColumnDef<DepartmentTableRow>[] = [
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <DepartmentCell department={row.original} />,
    header: "Department",
    id: "department",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-0 md:z-20 md:bg-background",
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
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[260px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      skeleton: { type: "text", width: "w-28" },
      sticky: true,
    },
    size: 300,
  },
];
