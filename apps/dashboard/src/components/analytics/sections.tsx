"use client";

import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import type { ReactNode } from "react";
import { AnalyticsSection } from "@/components/analytics/analytics-section";
import {
  formatAnalyticsDateTime,
  formatAnalyticsLabel,
  getShare,
} from "./utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type AnalyticsData = RouterOutputs["analytics"]["get"];
type AnalyticsEvent = AnalyticsData["byType"][number];
type PageViewPoint = AnalyticsData["pageViewsByDay"][number];
type TrafficSource = AnalyticsData["trafficSources"][number];
type LeadSource = AnalyticsData["leadSources"][number];

export function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-card p-5 transition-all duration-300">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-3 text-xl font-medium">{value.toLocaleString()}</p>
    </div>
  );
}

function AnalyticsPanel({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="border border-border bg-card p-5 transition-all duration-300">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function PageViewsChart({ points }: { points: PageViewPoint[] }) {
  const maxViews = Math.max(...points.map((day) => day.count), 1);

  return (
    <AnalyticsPanel title="Page views (30 days)">
      <div className="flex h-40 items-end gap-[2px]">
        {points.map((day) => (
          <div
            className="flex-1 rounded-t bg-primary"
            key={day.date}
            style={{
              height: `${(day.count / maxViews) * 100}%`,
              minHeight: day.count > 0 ? "4px" : "1px",
            }}
            title={`${day.date}: ${day.count} views`}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </AnalyticsPanel>
  );
}

export function PageViewsSection({ points }: { points: PageViewPoint[] }) {
  if (!points.length) {
    return null;
  }

  return (
    <AnalyticsSection
      description="A 30-day traffic trend for recent site activity."
      title="Page views"
    >
      <PageViewsChart points={points} />
    </AnalyticsSection>
  );
}

export function EventTypeSection({ events }: { events: AnalyticsEvent[] }) {
  if (!events.length) {
    return null;
  }

  return (
    <AnalyticsSection
      description="High-level activity mix across the captured analytics stream."
      title="Events by type"
    >
      <AnalyticsPanel title="Events by type">
        <div className="space-y-3">
          {[...events]
            .sort((a, b) => b.count - a.count)
            .map((event) => (
              <div
                className="flex items-center justify-between"
                key={event.eventType}
              >
                <span className="text-sm font-medium">
                  {formatAnalyticsLabel(event.eventType)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {event.count.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </AnalyticsPanel>
    </AnalyticsSection>
  );
}

function RankedListCard<T>({
  empty,
  getKey,
  items,
  renderItem,
  title,
}: {
  empty: string;
  getKey: (item: T) => string;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  title: string;
}) {
  return (
    <AnalyticsPanel title={title}>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div>
          {items.map((item, index) => (
            <div
              className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0"
              key={getKey(item)}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
    </AnalyticsPanel>
  );
}

function ShareCard<T extends { count: number }>({
  empty,
  getKey,
  getLabel,
  items,
  title,
}: {
  empty: string;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  items: T[];
  title: string;
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <AnalyticsPanel title={title}>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div>
          {items.map((item) => {
            const pct = getShare(item.count, total);

            return (
              <div
                className="border-b border-border py-2.5 last:border-b-0"
                key={getKey(item)}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{getLabel(item)}</span>
                  <span className="text-muted-foreground">
                    {item.count.toLocaleString()} ({pct}%)
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
    </AnalyticsPanel>
  );
}

export function PageAndTrafficSection({
  topPages,
  trafficSources,
}: {
  topPages: AnalyticsData["topPages"];
  trafficSources: TrafficSource[];
}) {
  return (
    <AnalyticsSection
      description="Understand which pages and traffic sources are driving the most activity."
      title="Page and traffic mix"
    >
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <RankedListCard
          empty="No page view data yet."
          getKey={(page) => page.path}
          items={topPages}
          renderItem={(page, index) => (
            <>
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {index + 1}.
                </span>
                <span className="truncate text-sm font-medium">
                  {page.path}
                </span>
              </div>
              <span className="shrink-0 text-sm text-muted-foreground">
                {page.views.toLocaleString()} views
              </span>
            </>
          )}
          title="Top pages"
        />
        <ShareCard
          empty="No traffic data yet."
          getKey={(source) => source.source}
          getLabel={(source) => source.source}
          items={trafficSources}
          title="Traffic sources"
        />
      </div>
    </AnalyticsSection>
  );
}

export function DemandSignalsSection({
  leadSources,
  propertyViews,
}: {
  leadSources: LeadSource[];
  propertyViews: AnalyticsData["propertyViews"];
}) {
  return (
    <AnalyticsSection
      description="Compare property attention with lead-source quality to spot what is working."
      title="Demand signals"
    >
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <RankedListCard
          empty="No property view data yet."
          getKey={(property) => property.propertyId}
          items={propertyViews}
          renderItem={(property, index) => (
            <>
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {index + 1}.
                </span>
                <Link
                  className="max-w-48 truncate font-mono text-sm font-medium hover:underline"
                  href={`/properties?propertyId=${property.propertyId}&details=true`}
                  title={property.propertyId}
                >
                  {property.propertyId.slice(0, 8)}...
                </Link>
              </div>
              <span className="shrink-0 text-sm text-muted-foreground">
                {property.views.toLocaleString()} views
              </span>
            </>
          )}
          title="Most viewed properties"
        />
        <ShareCard
          empty="No lead data yet."
          getKey={(source) => source.source}
          getLabel={(source) => source.source}
          items={leadSources}
          title="Lead sources"
        />
      </div>
    </AnalyticsSection>
  );
}

export function AgentPerformanceSection({
  agents,
}: {
  agents: AnalyticsData["agentStats"];
}) {
  if (!agents.length) {
    return null;
  }

  return (
    <AnalyticsSection
      description="Review workload and completion cadence across the active team."
      title="Agent performance"
    >
      <AnalyticsPanel title="Agent performance">
        <div>
          {agents.map((agent) => (
            <div
              className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0"
              key={agent.id}
            >
              <div className="min-w-0">
                <span className="truncate text-sm font-medium">
                  {agent.name}
                </span>
                {agent.title ? (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {agent.title}
                  </span>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {agent.totalAppointments} appt
                  {agent.totalAppointments !== 1 ? "s" : ""}
                </span>
                <span className="font-medium text-success">
                  {agent.completedAppointments} completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </AnalyticsPanel>
    </AnalyticsSection>
  );
}

export function RecentEventsSection({
  events,
}: {
  events: AnalyticsData["recentEvents"];
}) {
  return (
    <AnalyticsSection
      description="The most recent site interactions captured by the analytics stream."
      title="Recent events"
    >
      <AnalyticsPanel title="Recent events">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No events yet. Events will appear once visitors interact with your
            website.
          </p>
        ) : (
          <div>
            {events.map((event) => (
              <div
                className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0"
                key={event.id}
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium">
                    {formatAnalyticsLabel(event.eventType)}
                  </span>
                  {event.path ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {event.path}
                    </span>
                  ) : null}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatAnalyticsDateTime(event.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </AnalyticsPanel>
    </AnalyticsSection>
  );
}
