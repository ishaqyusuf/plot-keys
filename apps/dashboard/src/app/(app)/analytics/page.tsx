import {
  createPrismaClient,
  getAgentPerformanceStats,
  getAnalyticsSummary,
  getLeadSourceBreakdown,
  getPageViewsByDay,
  getPropertyAnalytics,
  getTopPages,
  getTrafficSources,
} from "@plotkeys/db";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { ChartNoAxesCombined } from "lucide-react";
import Link from "next/link";

import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardStatGrid,
} from "../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../lib/session";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

type AnalyticsSummaryType = Awaited<ReturnType<typeof getAnalyticsSummary>>;
type AnalyticsEventType = AnalyticsSummaryType["byType"][number];
type AnalyticsRecentEvent = AnalyticsSummaryType["recentEvents"][number];
type PageViewPoint = Awaited<ReturnType<typeof getPageViewsByDay>>[number];
type TopPage = Awaited<ReturnType<typeof getTopPages>>[number];
type TrafficSource = Awaited<ReturnType<typeof getTrafficSources>>[number];
type PropertyView = Awaited<ReturnType<typeof getPropertyAnalytics>>[number];
type LeadSource = Awaited<ReturnType<typeof getLeadSourceBreakdown>>[number];
type AgentStat = Awaited<ReturnType<typeof getAgentPerformanceStats>>[number];

export default async function AnalyticsPage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;
  if (!prisma) throw new Error("Database not configured.");

  const [
    summary,
    pageViews,
    topPages,
    trafficSources,
    propertyViews,
    leadSources,
    agentStats,
  ] = await Promise.all([
    getAnalyticsSummary(prisma, companyId),
    getPageViewsByDay(prisma, companyId, 30),
    getTopPages(prisma, companyId),
    getTrafficSources(prisma, companyId),
    getPropertyAnalytics(prisma, companyId),
    getLeadSourceBreakdown(prisma, companyId),
    getAgentPerformanceStats(prisma, companyId),
  ]);

  const maxViews = Math.max(
    ...pageViews.map((day: PageViewPoint) => day.count),
    1,
  );
  const hasAnyData =
    summary.byType.length > 0 ||
    pageViews.length > 0 ||
    topPages.length > 0 ||
    trafficSources.length > 0 ||
    propertyViews.length > 0 ||
    leadSources.length > 0 ||
    agentStats.length > 0 ||
    summary.recentEvents.length > 0;

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Performance workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Analytics</DashboardPageTitle>
            <DashboardPageDescription>
              Track website activity, visitor behavior, and agent performance
              over the last 30 days.
            </DashboardPageDescription>
          </DashboardPageIntro>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardStatGrid>
        <Card className="border-border/65 bg-card/78">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {summary.totalEvents.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/65 bg-card/78">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {summary.uniqueVisitors.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/65 bg-card/78">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Page views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(
                summary.byType.find(
                  (type: AnalyticsEventType) => type.eventType === "page_view",
                )?.count ?? 0
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/65 bg-card/78">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads captured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(
                summary.byType.find(
                  (type: AnalyticsEventType) =>
                    type.eventType === "contact_form",
                )?.count ?? 0
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </DashboardStatGrid>

      {summary.byType.length > 0 ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Events by type</DashboardSectionTitle>
              <DashboardSectionDescription>
                High-level activity mix across the captured analytics stream.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Events by type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.byType
                  .sort(
                    (a: AnalyticsEventType, b: AnalyticsEventType) =>
                      b.count - a.count,
                  )
                  .map((t: AnalyticsEventType) => (
                    <div
                      key={t.eventType}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{t.eventType}</span>
                      <span className="text-sm text-muted-foreground">
                        {t.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      ) : null}

      {pageViews.length > 0 ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Page views</DashboardSectionTitle>
              <DashboardSectionDescription>
                A simple 30-day traffic trend for recent site activity.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Page views (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-end gap-[2px]">
                {pageViews.map((day: PageViewPoint) => (
                  <div
                    key={day.date}
                    className="flex-1 rounded-t bg-primary"
                    style={{
                      height: `${(day.count / maxViews) * 100}%`,
                      minHeight: day.count > 0 ? "4px" : "1px",
                    }}
                    title={`${day.date}: ${day.count} views`}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{pageViews[0]?.date}</span>
                <span>{pageViews[pageViews.length - 1]?.date}</span>
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      ) : null}

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Page and traffic mix</DashboardSectionTitle>
            <DashboardSectionDescription>
              Understand which pages and traffic sources are driving the most
              activity.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Top pages</CardTitle>
            </CardHeader>
            <CardContent>
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No page view data yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {topPages.map((page: TopPage, i: number) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between rounded-[1rem] border border-border/55 bg-background/45 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {i + 1}.
                        </span>
                        <span className="text-sm font-medium">{page.path}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {page.views.toLocaleString()} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Traffic sources</CardTitle>
            </CardHeader>
            <CardContent>
              {trafficSources.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No traffic data yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {trafficSources.map((src: TrafficSource) => {
                    const total = trafficSources.reduce(
                      (sum: number, s: TrafficSource) => sum + s.count,
                      0,
                    );
                    const pct =
                      total > 0 ? Math.round((src.count / total) * 100) : 0;
                    return (
                      <div
                        key={src.source}
                        className="rounded-[1rem] border border-border/55 bg-background/45 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{src.source}</span>
                          <span className="text-muted-foreground">
                            {src.count.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
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
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Demand signals</DashboardSectionTitle>
            <DashboardSectionDescription>
              Compare property attention with lead-source quality to spot what
              is working.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Most viewed properties</CardTitle>
            </CardHeader>
            <CardContent>
              {propertyViews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No property view data yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {propertyViews.map((pv: PropertyView, i: number) => (
                    <div
                      key={pv.propertyId}
                      className="flex items-center justify-between rounded-[1rem] border border-border/55 bg-background/45 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {i + 1}.
                        </span>
                        <Link
                          href={`/properties/${pv.propertyId}`}
                          className="max-w-48 truncate text-sm font-medium font-mono hover:underline"
                          title={pv.propertyId}
                        >
                          {pv.propertyId.slice(0, 8)}…
                        </Link>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {pv.views.toLocaleString()} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Lead sources</CardTitle>
            </CardHeader>
            <CardContent>
              {leadSources.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No lead data yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {leadSources.map((ls: LeadSource) => {
                    const total = leadSources.reduce(
                      (sum: number, s: LeadSource) => sum + s.count,
                      0,
                    );
                    const pct =
                      total > 0 ? Math.round((ls.count / total) * 100) : 0;
                    return (
                      <div
                        key={ls.source}
                        className="rounded-[1rem] border border-border/55 bg-background/45 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{ls.source}</span>
                          <span className="text-muted-foreground">
                            {ls.count.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
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
      </DashboardSection>

      {agentStats.length > 0 ? (
        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Agent performance</DashboardSectionTitle>
              <DashboardSectionDescription>
                Review workload and completion cadence across the active team.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/65 bg-card/78">
            <CardHeader>
              <CardTitle>Agent performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {agentStats.map((agent: AgentStat) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between rounded-[1rem] border border-border/55 bg-background/45 px-3 py-2.5"
                  >
                    <div>
                      <span className="text-sm font-medium">{agent.name}</span>
                      {agent.title ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {agent.title}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {agent.totalAppointments} appt
                        {agent.totalAppointments !== 1 ? "s" : ""}
                      </span>
                      <span className="font-medium text-green-600">
                        {agent.completedAppointments} completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      ) : null}

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Recent events</DashboardSectionTitle>
            <DashboardSectionDescription>
              The most recent site interactions captured by the analytics
              stream.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/65 bg-card/78">
          <CardHeader>
            <CardTitle>Recent events</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events yet. Events will appear once visitors interact with
                your website.
              </p>
            ) : (
              <div className="space-y-2.5">
                {summary.recentEvents.map((event: AnalyticsRecentEvent) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-[1rem] border border-border/55 bg-background/45 px-3 py-2.5"
                  >
                    <div>
                      <span className="text-sm font-medium">
                        {event.eventType}
                      </span>
                      {event.path ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {event.path}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(event.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardSection>

      {!hasAnyData ? (
        <DashboardEmptyState
          description="Analytics will appear once visitors start interacting with the website."
          icon={<ChartNoAxesCombined className="size-5" />}
          title="No analytics data yet"
        />
      ) : null}
    </DashboardPage>
  );
}
