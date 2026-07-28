import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { getPayrollPeriod } from "@/components/payroll/payroll-utils";
import { PayrollHeader } from "@/components/payroll-header";
import { PayrollSummary } from "@/components/payroll-summary";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/payroll/data-table";
import { PayrollSkeleton } from "@/components/tables/payroll/skeleton";
import {
  loadPayrollFilterParams,
  resolvePayrollListInput,
} from "@/hooks/use-payroll-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Payroll | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function PayrollPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const { periodMonth, periodYear } = getPayrollPeriod(params);
  const filters = loadPayrollFilterParams(params);
  const { sort } = loadSortParams(params);
  const periodInput = { periodMonth, periodYear };
  const listInput = resolvePayrollListInput(filters, sort, periodInput);
  const initialSettings = await getInitialTableSettings("payroll");

  batchPrefetch([
    trpc.payroll.periods.queryOptions(),
    trpc.payroll.summary.queryOptions(periodInput),
    trpc.payroll.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <PayrollHeader periodMonth={periodMonth} periodYear={periodYear} />
          <PayrollSummary periodMonth={periodMonth} periodYear={periodYear} />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<PayrollSkeleton />}>
              <DataTable
                initialSettings={initialSettings}
                periodMonth={periodMonth}
                periodYear={periodYear}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
