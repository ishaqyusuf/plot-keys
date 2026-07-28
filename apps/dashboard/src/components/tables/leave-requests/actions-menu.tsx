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
import type { LeaveRequestTableRow } from "./columns";

type Props = {
  row: LeaveRequestTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const canApproveOrReject = row.status === "pending";
  const canCancel = row.status === "pending" || row.status === "approved";
  const invalidateLeaveRequests = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.leaveRequests.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.leaveRequests.stats.queryKey(),
      }),
    ]);
  };
  const updateStatusMutation = useMutation(
    trpc.leaveRequests.updateStatus.mutationOptions({
      onSuccess: invalidateLeaveRequests,
    }),
  );

  if (!canApproveOrReject && !canCancel) {
    return <span className="text-xs text-muted-foreground">No actions</span>;
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
          {canApproveOrReject ? (
            <>
              <DropdownMenuItem
                disabled={updateStatusMutation.isPending}
                onClick={() => {
                  updateStatusMutation.mutate({
                    leaveRequestId: row.id,
                    status: "approved",
                  });
                }}
              >
                Approve request
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                disabled={updateStatusMutation.isPending}
                onClick={() => {
                  updateStatusMutation.mutate({
                    leaveRequestId: row.id,
                    status: "rejected",
                  });
                }}
              >
                Reject request
              </DropdownMenuItem>
            </>
          ) : null}

          {canApproveOrReject && canCancel ? <DropdownMenuSeparator /> : null}

          {canCancel ? (
            <DropdownMenuItem
              disabled={updateStatusMutation.isPending}
              onClick={() => {
                updateStatusMutation.mutate({
                  leaveRequestId: row.id,
                  status: "cancelled",
                });
              }}
            >
              Cancel request
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
