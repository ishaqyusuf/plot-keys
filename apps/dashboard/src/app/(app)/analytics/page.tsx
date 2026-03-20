import {
  createPrismaClient,
  getAnalyticsSummary,
  getPageViewsByDay,
} from "@plotkeys/db";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { requireOnboardedSession } from "../../../lib/session";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

export default async function AnalyticsPage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;

  const [summary, pageViews] = await Promise.all([
    getAnalyticsSummary(prisma, companyId),
    getPageViewsByDay(prisma, companyId, 30),
  ]);

  const maxViews = Math.max(...pageViews.map((d) => d.count), 1);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Website activity for the last 30 days
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {summary.totalEvents.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {summary.uniqueVisitors.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Event Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.byType.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Events by Type */}
      {summary.byType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Events by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.byType
                .sort((a, b) => b.count - a.count)
                .map((t) => (
                  <div
                    key={t.eventType}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{t.eventType}</span>
                    <span className="text-muted-foreground text-sm">
                      {t.count.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Views Chart (simple bar) */}
      {pageViews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Page Views (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-[2px]">
              {pageViews.map((day) => (
                <div
                  key={day.date}
                  className="bg-primary flex-1 rounded-t"
                  style={{
                    height: `${(day.count / maxViews) * 100}%`,
                    minHeight: day.count > 0 ? "4px" : "1px",
                  }}
                  title={`${day.date}: ${day.count} views`}
                />
              ))}
            </div>
            <div className="text-muted-foreground mt-1 flex justify-between text-xs">
              <span>{pageViews[0]?.date}</span>
              <span>{pageViews[pageViews.length - 1]?.date}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.recentEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No events yet. Events will appear once visitors interact with your
              website.
            </p>
          ) : (
            <div className="space-y-2">
              {summary.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium">
                      {event.eventType}
                    </span>
                    {event.path && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        {event.path}
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(event.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
