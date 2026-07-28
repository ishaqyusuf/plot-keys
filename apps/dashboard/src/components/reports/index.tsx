"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ReportsEmptyState } from "@/components/reports/report-empty-states";
import { useTRPC } from "@/trpc/client";
import {
  AgentPerformanceSection,
  BusinessSummarySection,
  ListingsPerformanceSection,
  type ReportsData,
} from "./sections";

type Props = {
  month: number;
  year: number;
};

function hasReportSummaryData(data: ReportsData["summary"]) {
  return (
    data.leads.new > 0 ||
    data.leads.qualified > 0 ||
    data.leads.closed > 0 ||
    data.appointments.total > 0 ||
    data.appointments.completed > 0 ||
    data.properties.new > 0 ||
    data.properties.published > 0 ||
    data.customers.new > 0 ||
    data.pageViews > 0
  );
}

export function ReportsView({ month, year }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reports.get.queryOptions({ month, year }),
  );
  const hasNoReportData =
    !hasReportSummaryData(data.summary) &&
    data.agentReport.length === 0 &&
    data.listingsReport.length === 0;

  return (
    <div className="flex flex-col gap-5">
      {hasNoReportData ? (
        <ReportsEmptyState />
      ) : (
        <>
          <BusinessSummarySection
            month={month}
            summary={data.summary}
            year={year}
          />
          <AgentPerformanceSection
            agents={data.agentReport}
            month={month}
            year={year}
          />
          <ListingsPerformanceSection listings={data.listingsReport} />
        </>
      )}
    </div>
  );
}
