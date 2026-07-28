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
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import type { NotificationTableRow } from "./columns";

type Props = {
  row: NotificationTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const invalidateNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.unreadCount.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.notifications.bell.queryKey(),
      }),
    ]);
  };
  const markReadMutation = useMutation(
    trpc.notifications.markRead.mutationOptions({
      onSuccess: invalidateNotifications,
    }),
  );

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icon.MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {row.link ? (
            <DropdownMenuItem asChild>
              <Link href={row.link}>View linked item</Link>
            </DropdownMenuItem>
          ) : null}

          {!row.isRead ? (
            <>
              {row.link ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                disabled={markReadMutation.isPending}
                onClick={() => {
                  markReadMutation.mutate({ notificationId: row.id });
                }}
              >
                Mark read
              </DropdownMenuItem>
            </>
          ) : !row.link ? (
            <DropdownMenuItem disabled>No actions</DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
