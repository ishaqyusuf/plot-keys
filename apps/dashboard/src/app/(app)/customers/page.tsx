import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { CustomersTable } from "@/components/tables/customers";
import { CustomersSkeleton } from "@/components/tables/customers/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadCustomersFilterParams } from "@/lib/customers-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Customers | Plot Keys",
};

type CustomersSearchParams = SearchParams & {
  createCustomer?: string;
  created?: string;
  error?: string;
  filter?: string;
  q?: string;
  sort?: string | string[];
};

type CustomersPageProps = {
  searchParams?: Promise<CustomersSearchParams>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadCustomersFilterParams(params);
  const { sort } = loadSortParams(params);
  const initialSettings = await getInitialTableSettings("customers");
  const canManage =
    session.activeMembership.role === "owner" ||
    session.activeMembership.role === "admin" ||
    session.activeMembership.role === "agent";

  batchPrefetch([
    trpc.customers.stats.queryOptions(),
    trpc.filters.customers.queryOptions(),
    trpc.customers.get.infiniteQueryOptions(
      { ...filters, sort },
      {
        getNextPageParam: ({ meta }) => meta?.cursor,
      },
    ),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.created ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>Customer added successfully.</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<CustomersSkeleton />}>
            <CustomersTable
              canManage={canManage}
              initialSettings={initialSettings}
            />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
