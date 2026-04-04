"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@plotkeys/ui/popover";
import { Icon } from "@plotkeys/ui/icons";
import Link from "next/link";

type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationBellProps = {
  unreadCount: number;
  recentNotifications: NotificationItem[];
};

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function NotificationIcon.Bell({
  unreadCount,
  recentNotifications,
}: NotificationBellProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative">
          <Icon.Icon.Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {recentNotifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Icon.Icon.Bell className="mx-auto size-6 text-muted-foreground/50" />
              <p className="mt-2 text-xs text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div>
              {recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b px-4 py-3 last:border-0 ${!n.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm leading-tight ${!n.isRead ? "font-semibold" : ""}`}
                    >
                      {n.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  {n.body && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {n.body}
                    </p>
                  )}
                  {n.link && (
                    <Link
                      href={n.link}
                      className="mt-1 inline-block text-xs text-primary hover:underline"
                    >
                      View →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t px-4 py-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
