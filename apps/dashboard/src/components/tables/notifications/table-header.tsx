"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { markAllNotificationsReadAction } from "@/app/actions";
import { NotificationsColumnVisibility } from "@/components/notifications-column-visibility";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardTableFilters,
  DashboardTableHeaderTop,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";
import { NotificationsSearchFilter } from "./search-filter";

type NotificationsPageHeaderProps = {
  notificationCount: number;
  onlyUnread: boolean;
  unreadCount: number;
};

type NotificationsTableHeaderProps = {
  notificationCount: number;
};

export function NotificationsPageHeader({
  notificationCount,
  onlyUnread,
  unreadCount,
}: NotificationsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Inbox workspace</DashboardPageEyebrow>
          <div className="flex items-center gap-3">
            <DashboardPageTitle>Notifications</DashboardPageTitle>
            {unreadCount > 0 ? <Badge>{unreadCount} unread</Badge> : null}
          </div>
          <DashboardPageDescription>
            Review workspace events, clear unread items, and return to linked
            workflows quickly.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          {unreadCount > 0 ? (
            <form action={markAllNotificationsReadAction}>
              <Button size="sm" type="submit" variant="outline">
                Mark all read
              </Button>
            </form>
          ) : null}
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {notificationCount} notification
          {notificationCount !== 1 ? "s" : ""}
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab active={!onlyUnread} href="/notifications">
              All
            </DashboardFilterTab>
            <DashboardFilterTab
              active={onlyUnread}
              href="/notifications?filter=unread"
            >
              Unread
            </DashboardFilterTab>
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function NotificationsTableHeader({
  notificationCount,
}: NotificationsTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Notification feed</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Work through unread items first and jump into the linked context
            when needed.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <NotificationsColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <NotificationsSearchFilter />
        <span className="text-sm text-muted-foreground">
          {notificationCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
