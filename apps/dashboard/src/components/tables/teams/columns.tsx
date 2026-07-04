"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Avatar, AvatarFallback, AvatarImage } from "@plotkeys/ui/avatar";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { WORK_ROLE_LABELS } from "@plotkeys/utils";
import type { inferRouterOutputs } from "@trpc/server";
import type { ColumnDef } from "@tanstack/react-table";
import {
  reactivateMemberAction,
  removeMemberAction,
  suspendMemberAction,
  updateMemberRoleAction,
} from "@/app/actions";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type TeamMemberRow = RouterOutputs["team"]["listMembers"]["data"][number];

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
  const isCurrentUser = member.userId === currentUserId;
  const isOwner = member.role === "owner";
  const canEdit = canManage && !isOwner && !isCurrentUser;

  if (!canEdit) {
    return (
      <span className="text-xs text-muted-foreground">
        {isCurrentUser ? "You" : "Protected"}
      </span>
    );
  }

  return (
    <div
      className="flex flex-wrap justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <form action={updateMemberRoleAction} className="flex items-center gap-2">
        <input name="membershipId" type="hidden" value={member.id} />
        <NativeSelect
          className="min-w-28 text-xs"
          defaultValue={member.role}
          name="role"
          size="sm"
        >
          <NativeSelectOption value="admin">Admin</NativeSelectOption>
          <NativeSelectOption value="agent">Agent</NativeSelectOption>
          <NativeSelectOption value="staff">Staff</NativeSelectOption>
        </NativeSelect>
        <Button size="sm" type="submit" variant="outline">
          Save
        </Button>
      </form>

      {member.status === "active" ? (
        <form action={suspendMemberAction}>
          <input name="membershipId" type="hidden" value={member.id} />
          <Button
            className="text-muted-foreground"
            size="sm"
            type="submit"
            variant="ghost"
          >
            Suspend
          </Button>
        </form>
      ) : member.status === "suspended" ? (
        <form action={reactivateMemberAction}>
          <input name="membershipId" type="hidden" value={member.id} />
          <Button size="sm" type="submit" variant="outline">
            Reactivate
          </Button>
        </form>
      ) : null}

      <form action={removeMemberAction}>
        <input name="membershipId" type="hidden" value={member.id} />
        <Button
          className="text-destructive hover:text-destructive"
          size="sm"
          type="submit"
          variant="ghost"
        >
          Remove
        </Button>
      </form>
    </div>
  );
}

export const columns = ({
  canManage,
  currentUserId,
}: TeamMemberColumnOptions): ColumnDef<TeamMemberRow>[] => [
  {
    accessorFn: (row) => row.user.name ?? row.user.email,
    cell: ({ row }) => <TeamMemberCell member={row.original} />,
    header: "Member",
    id: "member",
    meta: {
      className:
        "min-w-[260px] md:sticky md:left-0 md:z-20 md:bg-background",
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
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[360px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      skeleton: { type: "text", width: "w-32" },
      sticky: true,
    },
    size: 390,
  },
];
