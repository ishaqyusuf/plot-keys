import {
  createPrismaClient,
  getAgentPerformanceReport,
  getListingsReport,
  getMonthlyBusinessSummary,
} from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { FileBarChart2 } from "lucide-react";

import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPage,
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
} from "../../../components/dashboard/dashboard-page";
import { ExportCsvButton } from "../../../components/export-csv-button";
import { requireOnboardedSession } from "../../../lib/session";
import {
  exportAgentReportCsvAction,
  exportBusinessSummaryCsvAction,
  exportListingsReportCsvAction,
} from "../../actions";

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

type ReportsPageProps = {
  searchParams?: Promise<{ year?: string; month?: string }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;
  const params = (await searchParams) ?? {};

  const now = new Date();
  const year = params.year
    ? Number.parseInt(params.year, 10)
    : now.getFullYear();
  const month = params.month
    ? Number.parseInt(params.month, 10)
    : now.getMonth() + 1;

  const [summary, agentReport, listingsReport] = await Promise.all([
    getMonthlyBusinessSummary(prisma!, companyId, { year, month }),
    getAgentPerformanceReport(prisma!, companyId, { year, month }),
    getListingsReport(prisma!, companyId),
  ]);

  const months: { year: number; month: number; label: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleString("en-GB", { month: "short", year: "numeric" }),
    });
  }

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Reporting workspace</DashboardPageEyebrow>
            <DashboardPageTitle>Reports</DashboardPageTitle>
            <DashboardPageDescription>
              Monthly business summaries, agent performance, and listing health
              in one export-friendly view.
            </DashboardPageDescription>
          </DashboardPageIntro>
        </DashboardPageHeaderRow>
        <DashboardPageToolbar>
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              {months.map((m) => {
                const isActive = m.year === year && m.month === month;
                return (
                  <DashboardFilterTab
                    key={`${m.year}-${m.month}`}
                    active={isActive}
                    href={`/reports?year=${m.year}&month=${m.month}`}
                  >
                    {m.label}
                  </DashboardFilterTab>
                );
              })}
            </DashboardFilterTabs>
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Business summary</DashboardSectionTitle>
            <DashboardSectionDescription>
              A high-level monthly operating snapshot for{" "}
              {monthLabel(year, month)}.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>
        <Card className="border-border/65 bg-card/78">
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <CardTitle>Business summary — {monthLabel(year, month)}</CardTitle>
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
              <SummaryCard
                label="New properties"
                value={summary.properties.new}
              />
              <SummaryCard
                label="Published"
                value={summary.properties.published}
              />
              <SummaryCard
                label="New customers"
                value={summary.customers.new}
              />
              <SummaryCard label="Page views" value={summary.pageViews} />
            </div>
          </CardContent>
        </Card>
      </DashboardSection>

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
            <CardTitle>Agent performance — {monthLabel(year, month)}</CardTitle>
            <ExportCsvButton
              exportAction={exportAgentReportCsvAction.bind(null, year, month)}
              filename={`agent-performance-${year}-${month}.csv`}
              label="Export"
            />
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            {agentReport.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No agents found. Add agents to see performance data.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left">
                      <th className="pb-2 font-medium">Agent</th>
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 text-right font-medium">
                        Appointments
                      </th>
                      <th className="pb-2 text-right font-medium">Completed</th>
                      <th className="pb-2 text-right font-medium">Leads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentReport.map((agent) => (
                      <tr
                        key={agent.id}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-2.5 font-medium">{agent.name}</td>
                        <td className="py-2 text-muted-foreground">
                          {agent.title ?? "—"}
                        </td>
                        <td className="py-2 text-right">
                          {agent.appointments}
                        </td>
                        <td className="py-2 text-right">
                          <span className="font-medium text-green-600">
                            {agent.completed}
                          </span>
                        </td>
                        <td className="py-2 text-right">{agent.leads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Listings performance</DashboardSectionTitle>
            <DashboardSectionDescription>
              Track listing attention and appointment generation over the last
              30 days.
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
            {listingsReport.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No properties found. Add properties to see listing data.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 text-right font-medium">
                        Views (30d)
                      </th>
                      <th className="pb-2 text-right font-medium">
                        Appointments
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listingsReport.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="max-w-48 truncate py-2 font-medium">
                          {p.title}
                        </td>
                        <td className="py-2">
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {p.type ?? "—"}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <Badge
                            variant={
                              p.publishState === "published"
                                ? "default"
                                : "outline"
                            }
                            className="text-xs capitalize"
                          >
                            {p.publishState ?? p.status}
                          </Badge>
                        </td>
                        <td className="py-2 text-right">{p.views30d}</td>
                        <td className="py-2 text-right">{p.appointments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardSection>

      {agentReport.length === 0 && listingsReport.length === 0 ? (
        <DashboardEmptyState
          description="Reports will become more useful as agents, listings, and business events accumulate."
          icon={<FileBarChart2 className="size-5" />}
          title="No report data yet"
        />
      ) : null}
    </DashboardPage>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
