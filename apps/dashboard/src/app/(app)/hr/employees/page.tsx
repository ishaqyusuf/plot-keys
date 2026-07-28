import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { EmployeesHeader } from "@/components/employees-header";
import { EmployeeInvites } from "@/components/employees-invites";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/employees/data-table";
import { EmployeesSkeleton } from "@/components/tables/employees/skeleton";
import {
  canManageWorkspaceMembers,
  getWorkspaceInviteContext,
} from "@/components/team/team-access";
import {
  loadEmployeesFilterParams,
  resolveEmployeesListInput,
} from "@/hooks/use-employees-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Employees | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function EmployeesPage({ searchParams }: Props) {
  const session = await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadEmployeesFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveEmployeesListInput(filters, sort);
  const canManage = canManageWorkspaceMembers(session.activeMembership.role);
  const inviteContext = getWorkspaceInviteContext();
  const initialSettings = await getInitialTableSettings("employees");

  batchPrefetch([
    trpc.employees.stats.queryOptions(),
    trpc.employees.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  ]);

  if (canManage) {
    prefetch(trpc.team.listInvites.queryOptions());
  }

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <EmployeesHeader canManage={canManage} />

          {canManage ? <EmployeeInvites {...inviteContext} /> : null}

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<EmployeesSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
