import {
  createPrismaClient,
  getAgentPerformanceReport,
  getListingsReport,
  getMonthlyBusinessSummary,
} from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { requireOnboardedSession } from "../../../lib/session";
import { ExportCsvButton } from "../../../components/export-csv-button";
import {
  exportBusinessSummaryCsvAction,
  exportAgentReportCsvAction,
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
  const year = params.year ? Number.parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? Number.parseInt(params.month, 10) : now.getMonth() + 1;

  const [summary, agentReport, listingsReport] = await Promise.all([
    getMonthlyBusinessSummary(prisma!, companyId, { year, month }),
    getAgentPerformanceReport(prisma!, companyId, { year, month }),
    getListingsReport(prisma!, companyId),
  ]);

  // Build month tabs for last 6 months
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
    <div className="container mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm">
            Monthly business performance summaries
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap gap-2">
        {months.map((m) => {
          const isActive = m.year === year && m.month === month;
          return (
            <a
              key={`${m.year}-${m.month}`}
              href={`/reports?year=${m.year}&month=${m.month}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {m.label}
            </a>
          );
        })}
      </div>

      {/* Business Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Business Summary — {monthLabel(year, month)}</CardTitle>
          <ExportCsvButton
            exportAction={exportBusinessSummaryCsvAction.bind(null, year, month)}
            filename={`business-summary-${year}-${month}.csv`}
            label="Export"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard label="New Leads" value={summary.leads.new} />
            <SummaryCard label="Qualified" value={summary.leads.qualified} />
            <SummaryCard label="Closed" value={summary.leads.closed} />
            <SummaryCard label="Appointments" value={summary.appointments.total} />
            <SummaryCard label="Completed" value={summary.appointments.completed} />
            <SummaryCard label="New Properties" value={summary.properties.new} />
            <SummaryCard label="Published" value={summary.properties.published} />
            <SummaryCard label="New Customers" value={summary.customers.new} />
            <SummaryCard label="Page Views" value={summary.pageViews} />
          </div>
        </CardContent>
      </Card>

      {/* Agent Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agent Performance — {monthLabel(year, month)}</CardTitle>
          <ExportCsvButton
            exportAction={exportAgentReportCsvAction.bind(null, year, month)}
            filename={`agent-performance-${year}-${month}.csv`}
            label="Export"
          />
        </CardHeader>
        <CardContent>
          {agentReport.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No agents found. Add agents to see performance data.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Agent</th>
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium text-right">Appointments</th>
                    <th className="pb-2 font-medium text-right">Completed</th>
                    <th className="pb-2 font-medium text-right">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {agentReport.map((agent) => (
                    <tr key={agent.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{agent.name}</td>
                      <td className="py-2 text-muted-foreground">
                        {agent.title ?? "—"}
                      </td>
                      <td className="py-2 text-right">{agent.appointments}</td>
                      <td className="py-2 text-right">
                        <span className="text-green-600 font-medium">
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

      {/* Listings Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Listings Performance (30 days)</CardTitle>
          <ExportCsvButton
            exportAction={exportListingsReportCsvAction}
            filename="listings-report.csv"
            label="Export"
          />
        </CardHeader>
        <CardContent>
          {listingsReport.length === 0 ? (
            <p className="text-muted-foreground text-sm">
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
                    <th className="pb-2 font-medium text-right">Views (30d)</th>
                    <th className="pb-2 font-medium text-right">Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {listingsReport.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 font-medium max-w-48 truncate">
                        {p.title}
                      </td>
                      <td className="py-2">
                        <Badge variant="outline" className="capitalize text-xs">
                          {p.type ?? "—"}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <Badge
                          variant={p.publishState === "published" ? "default" : "outline"}
                          className="capitalize text-xs"
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
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border px-4 py-3">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
