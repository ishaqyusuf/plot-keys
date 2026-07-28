"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import {
  formatCurrency,
  payrollStatusConfig,
} from "@/components/payroll/payroll-utils";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type PayrollEntryTableRow =
  RouterOutputs["payroll"]["list"]["data"][number];

function EmployeeCell({ entry }: { entry: PayrollEntryTableRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {entry.employee.name}
        </p>
        <Badge variant={payrollStatusConfig[entry.status].variant}>
          {payrollStatusConfig[entry.status].label}
        </Badge>
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {entry.employee.title ?? "No title"}
      </p>
    </div>
  );
}

function AmountCell({ entry }: { entry: PayrollEntryTableRow }) {
  return (
    <div className="space-y-0.5 text-sm">
      <p className="text-foreground">
        Gross {formatCurrency(entry.grossAmount, entry.currency)}
      </p>
      <p className="text-xs text-muted-foreground">
        Net {formatCurrency(entry.netAmount, entry.currency)}
      </p>
    </div>
  );
}

function NotesCell({ entry }: { entry: PayrollEntryTableRow }) {
  return (
    <p className="line-clamp-2 max-w-[340px] text-sm text-muted-foreground">
      {entry.notes ?? "No notes"}
    </p>
  );
}

function ActionsCell({ entry }: { entry: PayrollEntryTableRow }) {
  return <ActionsMenu row={entry} />;
}

export const columns: ColumnDef<PayrollEntryTableRow>[] = [
  createSelectColumn<PayrollEntryTableRow>(),
  {
    accessorFn: (row) => row.employee.name,
    cell: ({ row }) => <EmployeeCell entry={row.original} />,
    header: "Employee",
    id: "entry",
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
    cell: ({ row }) => <AmountCell entry={row.original} />,
    header: "Amount",
    id: "amount",
    meta: {
      className: "min-w-[240px]",
      headerLabel: "Amount",
      skeleton: { type: "text", width: "w-40" },
    },
    size: 260,
  },
  {
    cell: ({ row }) => <NotesCell entry={row.original} />,
    header: "Notes",
    id: "notes",
    meta: {
      className: "min-w-[260px]",
      headerLabel: "Notes",
      skeleton: { type: "text", width: "w-44" },
    },
    size: 320,
  },
  {
    cell: ({ row }) => <ActionsCell entry={row.original} />,
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
