"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@plotkeys/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { NotificationBellContent } from "./notification-bell-content";
import type { NotificationItem } from "./notification-bell-types";

const emptyBellData: {
  recent: NotificationItem[];
  unreadCount: number;
} = {
  recent: [],
  unreadCount: 0,
};

export function NotificationBell() {
  const trpc = useTRPC();
  const { data = emptyBellData } = useQuery(
    trpc.notifications.bell.queryOptions(),
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 flex items-center relative"
        >
          <Icon.Bell size={16} />
          {data.unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {data.unreadCount > 9 ? "9+" : data.unreadCount}
            </span>
          ) : null}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <NotificationBellContent
          recentNotifications={data.recent}
          unreadCount={data.unreadCount}
        />
      </PopoverContent>
    </Popover>
  );
}
