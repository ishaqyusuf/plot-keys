"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChartNoAxesCombined } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardStatGrid } from "@/components/dashboard/dashboard-page";
import { useTRPC } from "@/trpc/client";
import {
  AgentPerformanceSection,
  AnalyticsHeader,
  DemandSignalsSection,
  EventTypeSection,
  MetricCard,
  PageAndTrafficSection,
  PageViewsSection,
  RecentEventsSection,
} from "./sections";

export function AnalyticsDashboard() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.workspace.getAnalytics.queryOptions(),
  );
  const pageViews =
    data.byType.find((type) => type.eventType === "page_view")?.count ?? 0;
  const leadsCaptured =
    data.byType.find((type) => type.eventType === "contact_form")?.count ?? 0;
  const hasAnyData =
    data.byType.length > 0 ||
    data.pageViewsByDay.length > 0 ||
    data.topPages.length > 0 ||
    data.trafficSources.length > 0 ||
    data.propertyViews.length > 0 ||
    data.leadSources.length > 0 ||
    data.agentStats.length > 0 ||
    data.recentEvents.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <AnalyticsHeader />

      <DashboardStatGrid>
        <MetricCard label="Total events" value={data.totalEvents} />
        <MetricCard label="Unique visitors" value={data.uniqueVisitors} />
        <MetricCard label="Page views" value={pageViews} />
        <MetricCard label="Leads captured" value={leadsCaptured} />
      </DashboardStatGrid>

      {hasAnyData ? (
        <>
          <EventTypeSection events={data.byType} />
          <PageViewsSection points={data.pageViewsByDay} />
          <PageAndTrafficSection
            topPages={data.topPages}
            trafficSources={data.trafficSources}
          />
          <DemandSignalsSection
            leadSources={data.leadSources}
            propertyViews={data.propertyViews}
          />
          <AgentPerformanceSection agents={data.agentStats} />
          <RecentEventsSection events={data.recentEvents} />
        </>
      ) : (
        <DashboardEmptyState
          description="Analytics will appear once visitors start interacting with the website."
          icon={<ChartNoAxesCombined className="size-5" />}
          title="No analytics data yet"
        />
      )}
    </div>
  );
}
