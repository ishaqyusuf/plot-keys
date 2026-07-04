"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import type { ColumnDef } from "@tanstack/react-table";
import { markPayrollPaidAction } from "@/app/actions";
import {
  formatCurrency,
  payrollStatusConfig,
} from "@/components/payroll/payroll-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type PayrollEntryTableRow =
  RouterOutputs["workspace"]["listPayrollEntries"]["data"][number];

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
  return (
    <div
      className="flex flex-wrap justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      {entry.status === "pending" ? (
        <form action={markPayrollPaidAction}>
          <input name="payrollEntryId" type="hidden" value={entry.id} />
          <Button size="sm" type="submit">
            Mark paid
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export const columns: ColumnDef<PayrollEntryTableRow>[] = [
  {
    accessorFn: (row) => row.employee.name,
    cell: ({ row }) => <EmployeeCell entry={row.original} />,
    header: "Employee",
    id: "entry",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-0 md:z-20 md:bg-background",
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
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[180px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      skeleton: { type: "text", width: "w-24" },
      sticky: true,
    },
    size: 220,
  },
];
