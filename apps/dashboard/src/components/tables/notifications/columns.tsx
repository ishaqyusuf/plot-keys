"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Icon } from "@plotkeys/ui/icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import {
  formatNotificationDate,
  formatNotificationType,
} from "@/components/notifications/notification-utils";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

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
        <Icon.Bell className="size-4 text-muted-foreground" />
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

function MetaCell({ notification }: { notification: NotificationTableRow }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-foreground">
        {formatNotificationDate(notification.createdAt)}
      </p>
      <Badge variant="outline" className="text-xs capitalize">
        {formatNotificationType(notification.type)}
      </Badge>
    </div>
  );
}

function ActionsCell({ notification }: { notification: NotificationTableRow }) {
  return <ActionsMenu row={notification} />;
}

export const columns: ColumnDef<NotificationTableRow>[] = [
  createSelectColumn<NotificationTableRow>(),
  {
    accessorFn: (row) => row.title,
    cell: ({ row }) => <NotificationCell notification={row.original} />,
    header: "Notification",
    id: "notification",
    meta: {
      className:
        "min-w-[360px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
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
