import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ActiveCustomers } from "@/components/active-customers";
import { CollapsibleSummary } from "@/components/collapsible-summary";
import { CustomerSummarySkeleton } from "@/components/customer-summary-skeleton";
import { CustomersHeader } from "@/components/customers-header";
import { ErrorFallback } from "@/components/error-fallback";
import { InactiveCustomers } from "@/components/inactive-customers";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/customers/data-table";
import { CustomersSkeleton } from "@/components/tables/customers/skeleton";
import { TotalCustomers } from "@/components/total-customers";
import { VipCustomers } from "@/components/vip-customers";
import { canManageCustomerRecords } from "@/components/workspace/workspace-access";
import {
  loadCustomerFilterParams,
  resolveCustomerListInput,
} from "@/hooks/use-customer-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Customers | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const session = await requireOnboardedSession();
  const params = await props.searchParams;
  const filter = loadCustomerFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveCustomerListInput(filter, sort);
  const initialSettings = await getInitialTableSettings("customers");
  const canManage = canManageCustomerRecords(session.activeMembership.role);

  batchPrefetch([
    trpc.customers.stats.queryOptions(),
    trpc.customers.get.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <CollapsibleSummary>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
              <Suspense fallback={<CustomerSummarySkeleton />}>
                <TotalCustomers />
              </Suspense>
              <Suspense fallback={<CustomerSummarySkeleton />}>
                <ActiveCustomers />
              </Suspense>
              <Suspense fallback={<CustomerSummarySkeleton />}>
                <VipCustomers />
              </Suspense>
              <Suspense fallback={<CustomerSummarySkeleton />}>
                <InactiveCustomers />
              </Suspense>
            </div>
          </CollapsibleSummary>

          <CustomersHeader canManage={canManage} />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<CustomersSkeleton />}>
              <DataTable
                canManage={canManage}
                initialSettings={initialSettings}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
