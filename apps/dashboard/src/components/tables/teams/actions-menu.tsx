"use client";

import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { TeamMemberRow } from "./columns";

type Props = {
  canManage: boolean;
  currentUserId: string;
  row: TeamMemberRow;
};

const editableRoles = [
  { label: "Make admin", value: "admin" },
  { label: "Make agent", value: "agent" },
  { label: "Make staff", value: "staff" },
] as const;

export function ActionsMenu({ canManage, currentUserId, row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isCurrentUser = row.userId === currentUserId;
  const isOwner = row.role === "owner";
  const canEdit = canManage && !isOwner && !isCurrentUser;
  const invalidateMembers = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.team.listMembers.infiniteQueryKey(),
    });
  };
  const updateRoleMutation = useMutation(
    trpc.team.updateMemberRole.mutationOptions({
      onSuccess: invalidateMembers,
    }),
  );
  const suspendMutation = useMutation(
    trpc.team.suspendMember.mutationOptions({
      onSuccess: invalidateMembers,
    }),
  );
  const reactivateMutation = useMutation(
    trpc.team.reactivateMember.mutationOptions({
      onSuccess: invalidateMembers,
    }),
  );
  const removeMutation = useMutation(
    trpc.team.removeMember.mutationOptions({
      onSuccess: invalidateMembers,
    }),
  );
  const isPending =
    updateRoleMutation.isPending ||
    suspendMutation.isPending ||
    reactivateMutation.isPending ||
    removeMutation.isPending;

  if (!canEdit) {
    return (
      <span className="text-xs text-muted-foreground">
        {isCurrentUser ? "You" : "Protected"}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icon.MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {editableRoles
            .filter((role) => role.value !== row.role)
            .map((role) => (
              <DropdownMenuItem
                disabled={isPending}
                key={role.value}
                onClick={() => {
                  updateRoleMutation.mutate({
                    membershipId: row.id,
                    role: role.value,
                  });
                }}
              >
                {role.label}
              </DropdownMenuItem>
            ))}

          <DropdownMenuSeparator />

          {row.status === "active" ? (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => {
                suspendMutation.mutate({ membershipId: row.id });
              }}
            >
              Suspend member
            </DropdownMenuItem>
          ) : row.status === "suspended" ? (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => {
                reactivateMutation.mutate({ membershipId: row.id });
              }}
            >
              Reactivate member
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive"
            disabled={isPending}
            onClick={() => {
              removeMutation.mutate({ membershipId: row.id });
            }}
          >
            Remove member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
