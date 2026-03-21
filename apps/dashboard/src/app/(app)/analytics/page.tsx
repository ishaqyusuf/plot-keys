import {
  createPrismaClient,
  getAnalyticsSummary,
  getLeadSourceBreakdown,
  getPageViewsByDay,
  getPropertyAnalytics,
  getTopPages,
  getTrafficSources,
  getAgentPerformanceStats,
} from "@plotkeys/db";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import Link from "next/link";
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

  const [summary, pageViews, topPages, trafficSources, propertyViews, leadSources, agentStats] =
    await Promise.all([
      getAnalyticsSummary(prisma, companyId),
      getPageViewsByDay(prisma, companyId, 30),
      getTopPages(prisma, companyId),
      getTrafficSources(prisma, companyId),
      getPropertyAnalytics(prisma, companyId),
      getLeadSourceBreakdown(prisma, companyId),
      getAgentPerformanceStats(prisma, companyId),
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(
                summary.byType.find((t) => t.eventType === "page_view")
                  ?.count ?? 0
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Leads Captured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(
                summary.byType.find((t) => t.eventType === "contact_form")
                  ?.count ?? 0
              ).toLocaleString()}
            </p>
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

      {/* Top Pages and Traffic Sources side by side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No page view data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topPages.map((page, i) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs font-medium">
                        {i + 1}.
                      </span>
                      <span className="text-sm font-medium">{page.path}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {page.views.toLocaleString()} views
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {trafficSources.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No traffic data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {trafficSources.map((src) => {
                  const total = trafficSources.reduce(
                    (sum, s) => sum + s.count,
                    0,
                  );
                  const pct =
                    total > 0 ? Math.round((src.count / total) * 100) : 0;
                  return (
                    <div key={src.source}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{src.source}</span>
                        <span className="text-muted-foreground">
                          {src.count.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="bg-muted mt-1 h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Property Views and Lead Sources side by side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Property Views */}
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {propertyViews.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No property view data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {propertyViews.map((pv, i) => (
                  <div
                    key={pv.propertyId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs font-medium">
                        {i + 1}.
                      </span>
                      <Link
                        href={`/properties/${pv.propertyId}`}
                        className="text-sm font-medium font-mono truncate max-w-48 hover:underline"
                        title={pv.propertyId}
                      >
                        {pv.propertyId.slice(0, 8)}…
                      </Link>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {pv.views.toLocaleString()} views
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {leadSources.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No lead data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {leadSources.map((ls) => {
                  const total = leadSources.reduce(
                    (sum, s) => sum + s.count,
                    0,
                  );
                  const pct =
                    total > 0 ? Math.round((ls.count / total) * 100) : 0;
                  return (
                    <div key={ls.source}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{ls.source}</span>
                        <span className="text-muted-foreground">
                          {ls.count.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="bg-muted mt-1 h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      {agentStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentStats.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium">{agent.name}</span>
                    {agent.title && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        {agent.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {agent.totalAppointments} appt{agent.totalAppointments !== 1 ? "s" : ""}
                    </span>
                    <span className="text-green-600 font-medium">
                      {agent.completedAppointments} completed
                    </span>
                  </div>
                </div>
              ))}
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
