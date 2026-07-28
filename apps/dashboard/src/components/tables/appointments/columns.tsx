"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import { appointmentStatusConfig } from "@/components/appointments/appointment-utils";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type AppointmentTableRow =
  RouterOutputs["appointments"]["list"]["data"][number];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function AppointmentCell({
  appointment,
}: {
  appointment: AppointmentTableRow;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {appointment.name}
        </p>
        <Badge variant={appointmentStatusConfig[appointment.status].variant}>
          {appointmentStatusConfig[appointment.status].label}
        </Badge>
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {appointment.email}
        {appointment.phone ? ` - ${appointment.phone}` : ""}
      </p>
    </div>
  );
}

function DetailCell({ appointment }: { appointment: AppointmentTableRow }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-foreground">
        {formatDateTime(appointment.scheduledAt)}
      </p>
      <p className="text-xs text-muted-foreground">
        {appointment.durationMin ? `${appointment.durationMin} min` : "30 min"}
        {appointment.location ? ` - ${appointment.location}` : ""}
      </p>
    </div>
  );
}

function AssignmentCell({ appointment }: { appointment: AppointmentTableRow }) {
  return (
    <div className="space-y-0.5 text-sm">
      <p className="text-foreground">
        {appointment.agent ? appointment.agent.name : "Unassigned"}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {appointment.property
          ? appointment.property.title
          : appointment.lead
            ? `Lead: ${appointment.lead.name}`
            : "No linked record"}
      </p>
    </div>
  );
}

function ActionsCell({ appointment }: { appointment: AppointmentTableRow }) {
  return <ActionsMenu row={appointment} />;
}

export const columns: ColumnDef<AppointmentTableRow>[] = [
  createSelectColumn<AppointmentTableRow>(),
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <AppointmentCell appointment={row.original} />,
    header: "Visitor",
    id: "appointment",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Visitor",
      skeleton: { type: "text", width: "w-44" },
      sticky: true,
    },
    size: 300,
  },
  {
    cell: ({ row }) => <DetailCell appointment={row.original} />,
    header: "Schedule",
    id: "schedule",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Schedule",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 240,
  },
  {
    cell: ({ row }) => <AssignmentCell appointment={row.original} />,
    header: "Assignment",
    id: "assignment",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Assignment",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 240,
  },
  {
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-[320px] text-sm text-muted-foreground">
        {row.original.notes ?? "No notes"}
      </p>
    ),
    header: "Notes",
    id: "notes",
    meta: {
      className: "min-w-[240px]",
      headerLabel: "Notes",
      skeleton: { type: "text", width: "w-40" },
    },
    size: 300,
  },
  {
    cell: ({ row }) => <ActionsCell appointment={row.original} />,
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
