import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { getPayrollPeriod } from "@/components/payroll/payroll-utils";
import { PayrollTable } from "@/components/tables/payroll";
import { PayrollSkeleton } from "@/components/tables/payroll/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadPayrollFilterParams } from "@/lib/payroll-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Payroll | Plot Keys",
};

type PayrollPageProps = {
  searchParams?: Promise<
    SearchParams & {
      created?: string;
      error?: string;
      month?: string;
      q?: string;
      sort?: string | string[];
      year?: string;
    }
  >;
};

export default async function PayrollPage({ searchParams }: PayrollPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const { periodMonth, periodYear } = getPayrollPeriod(params);
  const filters = loadPayrollFilterParams(params);
  const { sort } = loadSortParams(params);
  const periodInput = { periodMonth, periodYear };
  const listInput = { ...periodInput, q: filters.q, sort };
  const initialSettings = await getInitialTableSettings("payroll");

  batchPrefetch([
    trpc.workspace.listPayrollPeriods.queryOptions(),
    trpc.workspace.getPayrollSummary.queryOptions(periodInput),
    trpc.workspace.listPayrollEntries.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    trpc.workspace.listEmployees.queryOptions({ size: 200, status: "active" }),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.created ? (
        <Alert>
          <AlertDescription>Payroll entry added.</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<PayrollSkeleton />}>
            <PayrollTable
              initialSettings={initialSettings}
              periodMonth={periodMonth}
              periodYear={periodYear}
            />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
