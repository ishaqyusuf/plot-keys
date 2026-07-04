"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import type { ColumnDef } from "@tanstack/react-table";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { markNotificationReadAction } from "@/app/actions";
import {
  formatNotificationDate,
  formatNotificationType,
} from "@/components/notifications/notification-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type NotificationTableRow =
  RouterOutputs["notifications"]["list"]["data"][number];

function NotificationCell({
  notification,
}: {
  notification: NotificationTableRow;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <BellIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 space-y-1">
        <div className="flex min-w-0 items-start gap-2">
          <p
            className={
              notification.isRead
                ? "truncate text-sm font-medium text-foreground/80"
                : "truncate text-sm font-medium text-foreground"
            }
          >
            {notification.title}
          </p>
          {!notification.isRead ? (
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
          ) : null}
        </div>
        {notification.body ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {notification.body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function MetaCell({
  notification,
}: {
  notification: NotificationTableRow;
}) {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-foreground">
        {formatNotificationDate(notification.createdAt)}
      </p>
      <Badge className="text-xs capitalize" variant="outline">
        {formatNotificationType(notification.type)}
      </Badge>
    </div>
  );
}

function ActionsCell({
  notification,
}: {
  notification: NotificationTableRow;
}) {
  return (
    <div
      className="flex flex-wrap justify-end gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      {notification.link ? (
        <Button asChild size="sm" variant="outline">
          <Link href={notification.link}>View</Link>
        </Button>
      ) : null}

      {!notification.isRead ? (
        <form action={markNotificationReadAction}>
          <input
            name="notificationId"
            type="hidden"
            value={notification.id}
          />
          <Button size="sm" type="submit" variant="ghost">
            Mark read
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export const columns: ColumnDef<NotificationTableRow>[] = [
  {
    accessorFn: (row) => row.title,
    cell: ({ row }) => <NotificationCell notification={row.original} />,
    header: "Notification",
    id: "notification",
    meta: {
      className:
        "min-w-[360px] md:sticky md:left-0 md:z-20 md:bg-background",
      headerLabel: "Notification",
      skeleton: { type: "text", width: "w-56" },
      sticky: true,
    },
    size: 460,
  },
  {
    cell: ({ row }) => <MetaCell notification={row.original} />,
    header: "Type",
    id: "meta",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Type",
      skeleton: { type: "text", width: "w-36" },
    },
    size: 240,
  },
  {
    cell: ({ row }) => <ActionsCell notification={row.original} />,
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[220px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      skeleton: { type: "text", width: "w-28" },
      sticky: true,
    },
    size: 260,
  },
];
