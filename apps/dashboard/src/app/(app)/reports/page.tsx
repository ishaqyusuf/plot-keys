import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { ReportsView } from "@/components/reports";
import { ReportsSkeleton } from "@/components/reports/skeleton";
import {
  getRecentReportPeriods,
  getReportPeriod,
} from "@/components/reports/utils";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Reports | Plot Keys",
};

type ReportsPageProps = {
  searchParams?: Promise<{ month?: string; year?: string }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const { month, year } = getReportPeriod(params);
  const periods = getRecentReportPeriods();

  batchPrefetch([trpc.workspace.getReports.queryOptions({ month, year })]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ReportsSkeleton />}>
            <ReportsView month={month} periods={periods} year={year} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
