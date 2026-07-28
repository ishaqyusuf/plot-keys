"use client";

import type { AppRouter } from "@plotkeys/api/router";
import type { inferRouterOutputs } from "@trpc/server";
import type { ReactNode } from "react";
import { ExportCsvButton } from "@/components/export-csv-button";
import {
  AgentPerformanceEmptyState,
  ListingsPerformanceEmptyState,
} from "@/components/reports/report-empty-states";
import { ReportSection } from "@/components/reports/report-section";
import {
  AgentPerformanceReportTable,
  ListingsPerformanceReportTable,
} from "@/components/reports/report-tables";
import { monthLabel } from "./utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ReportsData = RouterOutputs["reports"]["get"];

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-card p-4 transition-all duration-300">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-3 text-xl font-medium">{value.toLocaleString()}</p>
    </div>
  );
}

function ReportSurface({
  actions,
  children,
  title,
}: {
  actions: ReactNode;
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="border border-border bg-card p-5 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function toCsvValue(value: unknown) {
  if (value == null) return "";

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function businessSummaryToCsv(summary: ReportsData["summary"]) {
  return [
    `Business Summary — ${summary.period.label}`,
    "",
    "Metric,Value",
    `New Leads,${summary.leads.new}`,
    `Qualified Leads,${summary.leads.qualified}`,
    `Closed Leads,${summary.leads.closed}`,
    `Total Appointments,${summary.appointments.total}`,
    `Completed Appointments,${summary.appointments.completed}`,
    `New Properties,${summary.properties.new}`,
    `Published Properties,${summary.properties.published}`,
    `New Customers,${summary.customers.new}`,
    `Page Views,${summary.pageViews}`,
  ].join("\n");
}

function agentPerformanceToCsv(agents: ReportsData["agentReport"]) {
  const header = "Agent,Title,Appointments,Completed,Leads";
  const rows = agents.map((agent) =>
    [
      toCsvValue(agent.name),
      toCsvValue(agent.title),
      agent.appointments,
      agent.completed,
      agent.leads,
    ].join(","),
  );

  return [header, ...rows].join("\n");
}

function listingsReportToCsv(listings: ReportsData["listingsReport"]) {
  const header =
    "Title,Type,Status,Publish State,Price,Views (30d),Appointments,Listed";
  const rows = listings.map((listing) =>
    [
      toCsvValue(listing.title),
      toCsvValue(listing.type),
      toCsvValue(listing.status),
      toCsvValue(listing.publishState),
      listing.price ?? "",
      listing.views30d,
      listing.appointments,
      listing.createdAt.toISOString().split("T")[0],
    ].join(","),
  );

  return [header, ...rows].join("\n");
}

export function BusinessSummarySection({
  month,
  summary,
  year,
}: {
  month: number;
  summary: ReportsData["summary"];
  year: number;
}) {
  const label = monthLabel(year, month);

  return (
    <ReportSection
      description={`A high-level monthly operating snapshot for ${label}.`}
      title="Business summary"
    >
      <ReportSurface
        actions={
          <ExportCsvButton
            exportAction={() => businessSummaryToCsv(summary)}
            filename={`business-summary-${year}-${month}.csv`}
            label="Export"
          />
        }
        title={`Business summary - ${label}`}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SummaryCard label="New leads" value={summary.leads.new} />
          <SummaryCard label="Qualified" value={summary.leads.qualified} />
          <SummaryCard label="Closed" value={summary.leads.closed} />
          <SummaryCard
            label="Appointments"
            value={summary.appointments.total}
          />
          <SummaryCard
            label="Completed"
            value={summary.appointments.completed}
          />
          <SummaryCard label="New properties" value={summary.properties.new} />
          <SummaryCard label="Published" value={summary.properties.published} />
          <SummaryCard label="New customers" value={summary.customers.new} />
          <SummaryCard label="Page views" value={summary.pageViews} />
        </div>
      </ReportSurface>
    </ReportSection>
  );
}

export function AgentPerformanceSection({
  agents,
  month,
  year,
}: {
  agents: ReportsData["agentReport"];
  month: number;
  year: number;
}) {
  const label = monthLabel(year, month);

  return (
    <ReportSection
      description="Compare output and completions across the team for the selected period."
      title="Agent performance"
    >
      <ReportSurface
        actions={
          <ExportCsvButton
            exportAction={() => agentPerformanceToCsv(agents)}
            filename={`agent-performance-${year}-${month}.csv`}
            label="Export"
          />
        }
        title={`Agent performance - ${label}`}
      >
        {agents.length === 0 ? (
          <AgentPerformanceEmptyState />
        ) : (
          <AgentPerformanceReportTable agents={agents} />
        )}
      </ReportSurface>
    </ReportSection>
  );
}

export function ListingsPerformanceSection({
  listings,
}: {
  listings: ReportsData["listingsReport"];
}) {
  return (
    <ReportSection
      description="Track listing attention and appointment generation over the last 30 days."
      title="Listings performance"
    >
      <ReportSurface
        actions={
          <ExportCsvButton
            exportAction={() => listingsReportToCsv(listings)}
            filename="listings-report.csv"
            label="Export"
          />
        }
        title="Listings performance (30 days)"
      >
        {listings.length === 0 ? (
          <ListingsPerformanceEmptyState />
        ) : (
          <ListingsPerformanceReportTable listings={listings} />
        )}
      </ReportSurface>
    </ReportSection>
  );
}
