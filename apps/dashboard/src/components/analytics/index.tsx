"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  AgentPerformanceSection,
  DemandSignalsSection,
  EventTypeSection,
  MetricCard,
  PageAndTrafficSection,
  PageViewsSection,
  RecentEventsSection,
} from "./sections";

export function AnalyticsContent() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.analytics.get.queryOptions());
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
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total events" value={data.totalEvents} />
        <MetricCard label="Unique visitors" value={data.uniqueVisitors} />
        <MetricCard label="Page views" value={pageViews} />
        <MetricCard label="Leads captured" value={leadsCaptured} />
      </div>

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
        <div className="flex min-h-72 items-center justify-center px-5 py-10">
          <div className="flex max-w-sm flex-col items-center text-center">
            <h3 className="font-medium text-foreground">
              No analytics data yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Analytics will appear once visitors start interacting with the
              website.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
