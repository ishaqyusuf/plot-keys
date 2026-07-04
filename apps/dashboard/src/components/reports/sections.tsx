"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import type { inferRouterOutputs } from "@trpc/server";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
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
} from "@/components/dashboard/dashboard-page";
import { ExportCsvButton } from "@/components/export-csv-button";
import {
  AgentPerformanceEmptyState,
  AgentPerformanceReportTable,
  ListingsPerformanceEmptyState,
  ListingsPerformanceReportTable,
} from "@/components/tables/reports";
import {
  exportAgentReportCsvAction,
  exportBusinessSummaryCsvAction,
  exportListingsReportCsvAction,
} from "@/app/actions";
import { monthLabel, type ReportPeriod } from "./utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type ReportsData = RouterOutputs["workspace"]["getReports"];

type ReportsHeaderProps = {
  month: number;
  periods: ReportPeriod[];
  year: number;
};

export function ReportsHeader({ month, periods, year }: ReportsHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Reporting workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Reports</DashboardPageTitle>
          <DashboardPageDescription>
            Monthly business summaries, agent performance, and listing health in
            one export-friendly view.
          </DashboardPageDescription>
        </DashboardPageIntro>
      </DashboardPageHeaderRow>
      <DashboardPageToolbar>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            {periods.map((period) => (
              <DashboardFilterTab
                active={period.year === year && period.month === month}
                href={`/reports?year=${period.year}&month=${period.month}`}
                key={`${period.year}-${period.month}`}
              >
                {period.label}
              </DashboardFilterTab>
            ))}
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1rem] border border-border/70 bg-background/60 px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value.toLocaleString()}</p>
    </div>
  );
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
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Business summary</DashboardSectionTitle>
          <DashboardSectionDescription>
            A high-level monthly operating snapshot for {label}.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/65 bg-card/78">
        <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
          <CardTitle>Business summary - {label}</CardTitle>
          <ExportCsvButton
            exportAction={exportBusinessSummaryCsvAction.bind(
              null,
              year,
              month,
            )}
            filename={`business-summary-${year}-${month}.csv`}
            label="Export"
          />
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
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
            <SummaryCard
              label="Published"
              value={summary.properties.published}
            />
            <SummaryCard label="New customers" value={summary.customers.new} />
            <SummaryCard label="Page views" value={summary.pageViews} />
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
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
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Agent performance</DashboardSectionTitle>
          <DashboardSectionDescription>
            Compare output and completions across the team for the selected
            period.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/65 bg-card/78">
        <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
          <CardTitle>Agent performance - {label}</CardTitle>
          <ExportCsvButton
            exportAction={exportAgentReportCsvAction.bind(null, year, month)}
            filename={`agent-performance-${year}-${month}.csv`}
            label="Export"
          />
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          {agents.length === 0 ? (
            <AgentPerformanceEmptyState />
          ) : (
            <AgentPerformanceReportTable agents={agents} />
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

export function ListingsPerformanceSection({
  listings,
}: {
  listings: ReportsData["listingsReport"];
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Listings performance</DashboardSectionTitle>
          <DashboardSectionDescription>
            Track listing attention and appointment generation over the last 30
            days.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <Card className="border-border/65 bg-card/78">
        <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
          <CardTitle>Listings performance (30 days)</CardTitle>
          <ExportCsvButton
            exportAction={exportListingsReportCsvAction}
            filename="listings-report.csv"
            label="Export"
          />
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          {listings.length === 0 ? (
            <ListingsPerformanceEmptyState />
          ) : (
            <ListingsPerformanceReportTable listings={listings} />
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
