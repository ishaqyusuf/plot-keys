import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { ReportsView } from "@/components/reports";
import { ReportsSkeleton } from "@/components/reports/skeleton";
import {
  getRecentReportPeriods,
  getReportPeriod,
} from "@/components/reports/utils";
import { ReportsHeader } from "@/components/reports-header";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Reports | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ReportsPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const { month, year } = getReportPeriod(params);
  const periods = getRecentReportPeriods();

  prefetch(trpc.reports.get.queryOptions({ month, year }));

  return (
    <HydrateClient>
      <ScrollableContent>
        <div>
          <ReportsHeader month={month} periods={periods} year={year} />
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<ReportsSkeleton />}>
              <ReportsView month={month} year={year} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
