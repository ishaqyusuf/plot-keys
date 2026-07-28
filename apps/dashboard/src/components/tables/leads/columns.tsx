"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import { leadStatusConfig } from "@/components/leads/lead-utils";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type LeadTableRow = RouterOutputs["leads"]["list"]["data"][number];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function LeadCell({ lead }: { lead: LeadTableRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {lead.name}
        </p>
        <Badge variant={leadStatusConfig[lead.status].variant}>
          {leadStatusConfig[lead.status].label}
        </Badge>
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {lead.email}
        {lead.phone ? ` - ${lead.phone}` : ""}
      </p>
    </div>
  );
}

function ActionsCell({ lead }: { lead: LeadTableRow }) {
  return <ActionsMenu row={lead} />;
}

export const columns: ColumnDef<LeadTableRow>[] = [
  createSelectColumn<LeadTableRow>(),
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <LeadCell lead={row.original} />,
    header: "Lead",
    id: "lead",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Lead",
      skeleton: { type: "text", width: "w-44" },
      sticky: true,
    },
    size: 300,
  },
  {
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-[420px] text-sm text-muted-foreground">
        {row.original.message ?? "No message"}
      </p>
    ),
    header: "Message",
    id: "message",
    meta: {
      className: "min-w-[280px]",
      headerLabel: "Message",
      skeleton: { type: "text", width: "w-48" },
    },
    size: 420,
  },
  {
    accessorKey: "source",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.source ?? "contact_form"}
      </span>
    ),
    header: "Source",
    id: "source",
    meta: {
      headerLabel: "Source",
      skeleton: { type: "text", width: "w-24" },
    },
    size: 140,
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    header: "Captured",
    id: "captured",
    meta: {
      headerLabel: "Captured",
      skeleton: { type: "text", width: "w-28" },
    },
    size: 180,
  },
  {
    cell: ({ row }) => <ActionsCell lead={row.original} />,
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
