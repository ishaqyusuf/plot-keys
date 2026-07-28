"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Avatar, AvatarFallback, AvatarImage } from "@plotkeys/ui/avatar";
import { Badge } from "@plotkeys/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type AgentTableRow = RouterOutputs["agents"]["list"]["data"][number];

function AgentCell({ agent }: { agent: AgentTableRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar>
        {agent.imageUrl ? (
          <AvatarImage alt={agent.name} src={agent.imageUrl} />
        ) : null}
        <AvatarFallback>{agent.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {agent.name}
          </p>
          {agent.featured ? <Badge>Featured</Badge> : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {agent.title ?? "No title"}
        </p>
      </div>
    </div>
  );
}

function ContactCell({ agent }: { agent: AgentTableRow }) {
  return (
    <div className="space-y-0.5 text-sm">
      <p className="text-foreground">{agent.email ?? "-"}</p>
      <p className="text-xs text-muted-foreground">
        {agent.phone ?? "No phone"}
      </p>
    </div>
  );
}

function ActionsCell({ agent }: { agent: AgentTableRow }) {
  return <ActionsMenu row={agent} />;
}

export const columns: ColumnDef<AgentTableRow>[] = [
  createSelectColumn<AgentTableRow>(),
  {
    accessorFn: (row) => row.name,
    cell: ({ row }) => <AgentCell agent={row.original} />,
    header: "Agent",
    id: "agent",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Agent",
      skeleton: { type: "text", width: "w-44" },
      sticky: true,
    },
    size: 300,
  },
  {
    cell: ({ row }) => <ContactCell agent={row.original} />,
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
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-[360px] text-sm text-muted-foreground">
        {row.original.bio ?? "No bio yet"}
      </p>
    ),
    header: "Bio",
    id: "bio",
    meta: {
      className: "min-w-[280px]",
      headerLabel: "Bio",
      skeleton: { type: "text", width: "w-48" },
    },
    size: 340,
  },
  {
    accessorKey: "displayOrder",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.displayOrder ?? 0}
      </span>
    ),
    header: "Order",
    id: "displayOrder",
    meta: {
      headerLabel: "Order",
      skeleton: { type: "text", width: "w-12" },
    },
    size: 100,
  },
  {
    cell: ({ row }) => <ActionsCell agent={row.original} />,
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
