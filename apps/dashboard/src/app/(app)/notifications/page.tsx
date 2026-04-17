import { createPrismaClient, listNotificationsForUser } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent } from "@plotkeys/ui/card";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../lib/session";
import { markAllNotificationsReadAction } from "../../actions";

type NotificationsPageProps = {
  searchParams?: Promise<{ filter?: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const session = await requireOnboardedSession();
  const sp = (await searchParams) ?? {};
  const onlyUnread = sp.filter === "unread";

  const prisma = createPrismaClient().db;
  const companyId = session.activeMembership.companyId;
  const userId = session.user.id;

  const notifications = prisma
    ? await listNotificationsForUser(prisma, {
        companyId,
        userId,
        onlyUnread,
        take: 100,
      })
    : [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Inbox workspace</DashboardPageEyebrow>
            <div className="flex items-center gap-3">
              <DashboardPageTitle>Notifications</DashboardPageTitle>
              {unreadCount > 0 ? <Badge>{unreadCount} unread</Badge> : null}
            </div>
            <DashboardPageDescription>
              Review workspace events, clear unread items, and move back into
              the right workflow quickly.
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
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
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

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Notification feed</DashboardSectionTitle>
            <DashboardSectionDescription>
              Work through unread items first and jump straight into the linked
              context when needed.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        {notifications.length === 0 ? (
          <DashboardEmptyState
            description={
              onlyUnread ? "No unread notifications." : "No notifications yet."
            }
            icon={<BellIcon className="size-5" />}
            title="Nothing in the inbox"
          />
        ) : (
          <div className="grid gap-2.5">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`border-border/65 bg-card/78 transition-colors ${!n.isRead ? "border-primary/30 bg-primary/5" : ""}`}
              >
                <CardContent className="flex items-start gap-4 px-5 py-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <BellIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-medium ${!n.isRead ? "text-foreground" : "text-foreground/80"}`}
                      >
                        {n.title}
                      </p>
                      {!n.isRead ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </div>
                    {n.body ? (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {n.body}
                      </p>
                    ) : null}
                    <div className="mt-1 flex items-center gap-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(n.createdAt)}
                      </p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {n.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    {n.link ? (
                      <Link
                        href={n.link}
                        className="mt-1 inline-block text-xs text-primary underline underline-offset-2"
                      >
                        View →
                      </Link>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
