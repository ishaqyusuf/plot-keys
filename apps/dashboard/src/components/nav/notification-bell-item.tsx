"use client";

import { cn } from "@plotkeys/ui/cn";
import type { NotificationItem } from "./notification-bell-types";
import { TenantLink as Link } from "./tenant-link";

type Props = {
  notification: NotificationItem;
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

export function NotificationBellItem({ notification }: Props) {
  return (
    <div
      className={cn(
        "border-b border-border px-4 py-3 last:border-b-0",
        !notification.isRead && "bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "text-sm leading-tight",
            !notification.isRead && "font-semibold",
          )}
        >
          {notification.title}
        </p>
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
      {notification.body ? (
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.body}
        </p>
      ) : null}
      {notification.link ? (
        <Link
          className="mt-1 inline-block text-xs text-primary hover:underline"
          href={notification.link}
        >
          View →
        </Link>
      ) : null}
    </div>
  );
}
