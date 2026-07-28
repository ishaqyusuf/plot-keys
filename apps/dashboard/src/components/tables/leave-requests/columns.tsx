"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import {
  formatLeaveDate,
  leaveRequestStatusConfig,
  leaveTypeLabels,
} from "@/components/leave-requests/leave-request-utils";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type LeaveRequestTableRow =
  RouterOutputs["leaveRequests"]["list"]["data"][number];

function EmployeeCell({ request }: { request: LeaveRequestTableRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {request.employee.name}
        </p>
        <Badge variant={leaveRequestStatusConfig[request.status].variant}>
          {leaveRequestStatusConfig[request.status].label}
        </Badge>
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {request.employee.title ?? "No title"}
      </p>
    </div>
  );
}

function DatesCell({ request }: { request: LeaveRequestTableRow }) {
  return (
    <div className="space-y-0.5 text-sm">
      <p className="text-foreground">
        {formatLeaveDate(request.startDate)} to{" "}
        {formatLeaveDate(request.endDate)}
      </p>
      <p className="text-xs text-muted-foreground">
        {leaveTypeLabels[request.leaveType] ?? request.leaveType}
      </p>
    </div>
  );
}

function ReasonCell({ request }: { request: LeaveRequestTableRow }) {
  return (
    <p className="line-clamp-2 max-w-[360px] text-sm text-muted-foreground">
      {request.reason ?? "No reason provided"}
    </p>
  );
}

function ActionsCell({ request }: { request: LeaveRequestTableRow }) {
  return <ActionsMenu row={request} />;
}

export const columns: ColumnDef<LeaveRequestTableRow>[] = [
  createSelectColumn<LeaveRequestTableRow>(),
  {
    accessorFn: (row) => row.employee.name,
    cell: ({ row }) => <EmployeeCell request={row.original} />,
    header: "Employee",
    id: "request",
    meta: {
      className:
        "min-w-[280px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Employee",
      skeleton: { type: "text", width: "w-44" },
      sticky: true,
    },
    size: 300,
  },
  {
    cell: ({ row }) => <DatesCell request={row.original} />,
    header: "Dates",
    id: "dates",
    meta: {
      className: "min-w-[240px]",
      headerLabel: "Dates",
      skeleton: { type: "text", width: "w-40" },
    },
    size: 260,
  },
  {
    cell: ({ row }) => <ReasonCell request={row.original} />,
    header: "Reason",
    id: "reason",
    meta: {
      className: "min-w-[280px]",
      headerLabel: "Reason",
      skeleton: { type: "text", width: "w-48" },
    },
    size: 340,
  },
  {
    cell: ({ row }) => <ActionsCell request={row.original} />,
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
