import { createPrismaClient, listNotificationsForUser } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent } from "@plotkeys/ui/card";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { markAllNotificationsReadAction } from "../../actions";
import { requireOnboardedSession } from "../../../lib/session";

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

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/">← Dashboard</Link>
            </Button>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="font-serif text-3xl font-semibold text-foreground">
                Notifications
              </h1>
              {unreadCount > 0 ? (
                <Badge>{unreadCount} unread</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <form action={markAllNotificationsReadAction}>
                <Button size="sm" type="submit" variant="outline">
                  Mark all read
                </Button>
              </form>
            ) : null}
            <div className="flex items-center gap-1 rounded-md border border-input text-sm">
              <Link
                href="/notifications"
                className={`px-3 py-1.5 rounded-l-md transition-colors ${!onlyUnread ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                All
              </Link>
              <Link
                href="/notifications?filter=unread"
                className={`px-3 py-1.5 rounded-r-md transition-colors ${onlyUnread ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Unread
              </Link>
            </div>
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card className="py-20 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <BellIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {onlyUnread ? "No unread notifications." : "No notifications yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`bg-card transition-colors ${!n.isRead ? "border-primary/40 bg-primary/5" : ""}`}
              >
                <CardContent className="flex items-start gap-4 px-5 py-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <BellIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!n.isRead ? "text-foreground" : "text-foreground/80"}`}>
                        {n.title}
                      </p>
                      {!n.isRead ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </div>
                    {n.body ? (
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
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
      </div>
    </main>
  );
}
