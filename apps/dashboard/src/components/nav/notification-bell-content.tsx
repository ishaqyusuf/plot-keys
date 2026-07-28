"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { NotificationBellItem } from "./notification-bell-item";
import type { NotificationItem } from "./notification-bell-types";
import { TenantLink as Link } from "./tenant-link";

type Props = {
  recentNotifications: NotificationItem[];
  unreadCount: number;
};

function NotificationBellEmptyState() {
  return (
    <div className="px-4 py-8 text-center">
      <Icon.Bell className="mx-auto size-6 text-muted-foreground/50" />
      <p className="mt-2 text-xs text-muted-foreground">No notifications yet</p>
    </div>
  );
}

export function NotificationBellContent({
  recentNotifications,
  unreadCount,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Notifications</p>
        {unreadCount > 0 ? (
          <Badge variant="secondary" className="text-xs">
            {unreadCount} unread
          </Badge>
        ) : null}
      </div>
      <div className="max-h-72 overflow-y-auto">
        {recentNotifications.length === 0 ? (
          <NotificationBellEmptyState />
        ) : (
          <div>
            {recentNotifications.map((notification) => (
              <NotificationBellItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-border px-4 py-2">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href="/notifications">View all notifications</Link>
        </Button>
      </div>
    </>
  );
}
