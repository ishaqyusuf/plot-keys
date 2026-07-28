"use client";

import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import { useNotificationsFilterParams } from "@/hooks/use-notifications-filter-params";

export function NotificationsFilterTabs() {
  const { filter } = useNotificationsFilterParams();
  const onlyUnread = filter.filter === "unread";

  return (
    <HeaderLinkTabList>
      <HeaderLinkTab active={!onlyUnread} href="/notifications">
        All
      </HeaderLinkTab>
      <HeaderLinkTab active={onlyUnread} href="/notifications?filter=unread">
        Unread
      </HeaderLinkTab>
    </HeaderLinkTabList>
  );
}
