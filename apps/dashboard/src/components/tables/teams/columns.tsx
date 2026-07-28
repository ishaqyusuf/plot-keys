"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Avatar, AvatarFallback, AvatarImage } from "@plotkeys/ui/avatar";
import { Badge } from "@plotkeys/ui/badge";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type TeamMemberRow =
  RouterOutputs["team"]["listMembers"]["data"][number];

type TeamMemberColumnOptions = {
  canManage: boolean;
  currentUserId: string;
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  agent: "Agent",
  owner: "Owner",
  platform_admin: "Platform admin",
  staff: "Staff",
};

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
  admin: "secondary",
  agent: "outline",
  owner: "default",
  platform_admin: "default",
  staff: "outline",
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function TeamMemberCell({ member }: { member: TeamMemberRow }) {
  const displayName = member.user.name ?? member.user.email ?? "Unknown member";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar>
        {member.user.image ? (
          <AvatarImage alt={displayName} src={member.user.image} />
        ) : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {displayName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {member.user.email ?? "No email"}
        </p>
      </div>
    </div>
  );
}

function RoleBadges({ member }: { member: TeamMemberRow }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={roleVariant[member.role] ?? "outline"}>
        {roleLabels[member.role] ?? member.role}
      </Badge>
      <Badge variant="outline">
        {member.workRole
          ? (WORK_ROLE_LABELS[member.workRole] ?? member.workRole)
          : "Unassigned"}
      </Badge>
      {member.status !== "active" ? (
        <Badge variant={statusVariant[member.status] ?? "outline"}>
          {member.status}
        </Badge>
      ) : null}
    </div>
  );
}

function ActionsCell({
  currentUserId,
  member,
  canManage,
}: {
  canManage: boolean;
  currentUserId: string;
  member: TeamMemberRow;
}) {
  return (
    <ActionsMenu
      canManage={canManage}
      currentUserId={currentUserId}
      row={member}
    />
  );
}

export const columns = ({
  canManage,
  currentUserId,
}: TeamMemberColumnOptions): ColumnDef<TeamMemberRow>[] => [
  createSelectColumn<TeamMemberRow>(),
  {
    accessorFn: (row) => row.user.name ?? row.user.email,
    cell: ({ row }) => <TeamMemberCell member={row.original} />,
    header: "Member",
    id: "member",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Member",
      skeleton: { type: "text", width: "w-44" },
      sticky: true,
    },
    size: 300,
  },
  {
    cell: ({ row }) => <RoleBadges member={row.original} />,
    header: "Access",
    id: "access",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Access",
      skeleton: { type: "badge", width: "w-24" },
    },
    size: 240,
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    header: "Joined",
    id: "joined",
    meta: {
      headerLabel: "Joined",
      skeleton: { type: "text", width: "w-24" },
    },
    size: 140,
  },
  {
    cell: ({ row }) => (
      <ActionsCell
        canManage={canManage}
        currentUserId={currentUserId}
        member={row.original}
      />
    ),
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
