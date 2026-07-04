"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import {
  convertLeadToCustomerAction,
  updateLeadStatusAction,
} from "@/app/actions";
import {
  leadStatusConfig,
  type LeadStatus,
} from "@/components/leads/lead-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type LeadTableRow =
  RouterOutputs["workspace"]["listLeads"]["data"][number];

const statusFlow: Partial<
  Record<LeadStatus, { label: string; next: LeadStatus }>
> = {
  contacted: { label: "Mark qualified", next: "qualified" },
  new: { label: "Mark contacted", next: "contacted" },
  qualified: { label: "Mark closed", next: "closed" },
};

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
  const flow = statusFlow[lead.status];

  return (
    <div
      className="flex flex-wrap justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      {flow ? (
        <form action={updateLeadStatusAction}>
          <input name="leadId" type="hidden" value={lead.id} />
          <input name="status" type="hidden" value={flow.next} />
          <Button size="sm" type="submit" variant="outline">
            {flow.label}
          </Button>
        </form>
      ) : null}

      {lead.status === "qualified" ? (
        <form action={convertLeadToCustomerAction}>
          <input name="leadId" type="hidden" value={lead.id} />
          <input name="name" type="hidden" value={lead.name} />
          <input name="email" type="hidden" value={lead.email ?? ""} />
          <input name="phone" type="hidden" value={lead.phone ?? ""} />
          <Button size="sm" type="submit">
            To customer
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export const columns: ColumnDef<LeadTableRow>[] = [
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <LeadCell lead={row.original} />,
    header: "Lead",
    id: "lead",
    meta: {
      className: "min-w-[260px] md:sticky md:left-0 md:z-20 md:bg-background",
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
