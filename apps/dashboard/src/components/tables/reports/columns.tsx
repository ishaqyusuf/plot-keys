"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import type { inferRouterOutputs } from "@trpc/server";

type ReportsData = inferRouterOutputs<AppRouter>["workspace"]["getReports"];

export type AgentPerformanceReportRow = ReportsData["agentReport"][number];
export type AgentPerformanceReportRows = ReportsData["agentReport"];
export type ListingPerformanceReportRow =
  ReportsData["listingsReport"][number];
export type ListingPerformanceReportRows = ReportsData["listingsReport"];

export function AgentNameCell({
  agent,
}: {
  agent: AgentPerformanceReportRow;
}) {
  return <span className="font-medium">{agent.name}</span>;
}

export function AgentTitleCell({
  agent,
}: {
  agent: AgentPerformanceReportRow;
}) {
  return <span className="text-muted-foreground">{agent.title ?? "-"}</span>;
}

export function ReportNumberCell({
  emphasized,
  value,
}: {
  emphasized?: boolean;
  value: number;
}) {
  return (
    <span className={emphasized ? "font-medium text-green-600" : undefined}>
      {value}
    </span>
  );
}

export function ListingTitleCell({
  listing,
}: {
  listing: ListingPerformanceReportRow;
}) {
  return <span className="font-medium">{listing.title}</span>;
}

export function ListingTypeCell({
  listing,
}: {
  listing: ListingPerformanceReportRow;
}) {
  return (
    <Badge className="text-xs capitalize" variant="outline">
      {listing.type ?? "-"}
    </Badge>
  );
}

export function ListingStatusCell({
  listing,
}: {
  listing: ListingPerformanceReportRow;
}) {
  return (
    <Badge
      className="text-xs capitalize"
      variant={listing.publishState === "published" ? "default" : "outline"}
    >
      {listing.publishState ?? listing.status}
    </Badge>
  );
}
