"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import {
  employeeStatusConfig,
  employmentTypeLabels,
  formatEmployeeDate,
} from "@/components/employees/employee-utils";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type EmployeeTableRow =
  RouterOutputs["employees"]["list"]["data"][number];

function EmployeeCell({ employee }: { employee: EmployeeTableRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {employee.name}
        </p>
        <Badge variant={employeeStatusConfig[employee.status].variant}>
          {employeeStatusConfig[employee.status].label}
        </Badge>
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {employee.title ?? "No title"}
      </p>
    </div>
  );
}

function ContactCell({ employee }: { employee: EmployeeTableRow }) {
  return (
    <div className="space-y-0.5 text-sm">
      <p className="text-foreground">{employee.email ?? "-"}</p>
      <p className="text-xs text-muted-foreground">
        {employee.phone ?? "No phone"}
      </p>
    </div>
  );
}

function RoleCell({ employee }: { employee: EmployeeTableRow }) {
  const workRole = employee.workRole
    ? (WORK_ROLE_LABELS[employee.workRole] ?? employee.workRole)
    : "Unassigned";
  const employmentType = employee.employmentType
    ? (employmentTypeLabels[employee.employmentType] ?? employee.employmentType)
    : "Unassigned";

  return (
    <div className="space-y-1 text-sm">
      <p className="text-foreground">{workRole}</p>
      <p className="text-xs text-muted-foreground">{employmentType}</p>
    </div>
  );
}

function DepartmentCell({ employee }: { employee: EmployeeTableRow }) {
  return (
    <div className="space-y-0.5 text-sm">
      <p className="text-foreground">
        {employee.department?.name ?? "Unassigned"}
      </p>
      <p className="text-xs text-muted-foreground">
        {employee.startDate
          ? `Started ${formatEmployeeDate(employee.startDate)}`
          : "No start date"}
      </p>
    </div>
  );
}

function ActionsCell({ employee }: { employee: EmployeeTableRow }) {
  return <ActionsMenu row={employee} />;
}

export const columns: ColumnDef<EmployeeTableRow>[] = [
  createSelectColumn<EmployeeTableRow>(),
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <EmployeeCell employee={row.original} />,
    header: "Employee",
    id: "employee",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Employee",
      skeleton: { type: "text", width: "w-44" },
      sticky: true,
    },
    size: 300,
  },
  {
    cell: ({ row }) => <ContactCell employee={row.original} />,
    header: "Contact",
    id: "contact",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Contact",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 240,
  },
  {
    cell: ({ row }) => <RoleCell employee={row.original} />,
    header: "Role",
    id: "role",
    meta: {
      className: "min-w-[200px]",
      headerLabel: "Role",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 220,
  },
  {
    cell: ({ row }) => <DepartmentCell employee={row.original} />,
    header: "Department",
    id: "department",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Department",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 240,
  },
  {
    cell: ({ row }) => <ActionsCell employee={row.original} />,
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
