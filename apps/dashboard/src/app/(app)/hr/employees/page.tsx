import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { buildDashboardUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { isEmployeeStatus } from "@/components/employees/employee-utils";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { EmployeesTable } from "@/components/tables/employees";
import { EmployeesSkeleton } from "@/components/tables/employees/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadEmployeesFilterParams } from "@/lib/employees-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Employees | Plot Keys",
};

type EmployeesPageProps = {
  searchParams?: Promise<{
    q?: string;
    sort?: string | string[];
  } & SearchParams & {
    department?: string;
    error?: string;
    invited?: string;
    status?: string;
  }>;
};

export default async function EmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadEmployeesFilterParams(params);
  const { sort } = loadSortParams(params);
  const statusParam = filters.status ?? undefined;
  const status = isEmployeeStatus(statusParam) ? statusParam : undefined;
  const departmentId = filters.department?.trim() || undefined;
  const listInput = {
    departmentId,
    q: filters.q,
    sort,
    status,
  };
  const currentUserRole = session.activeMembership.role;
  const canManage =
    currentUserRole === "owner" ||
    currentUserRole === "admin" ||
    currentUserRole === "platform_admin";
  const isDevMode = process.env.NODE_ENV === "development";
  const appBaseUrl = buildDashboardUrl();
  const initialSettings = await getInitialTableSettings("employees");

  batchPrefetch([
    trpc.workspace.getEmployeeStats.queryOptions(),
    trpc.workspace.listEmployees.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    ...(canManage ? [trpc.team.listInvites.queryOptions()] : []),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.invited ? (
        <Alert>
          <AlertDescription>
            Employee invite sent. They&apos;ll receive an email to join and
            complete their details directly.
          </AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<EmployeesSkeleton />}>
            <EmployeesTable
              appBaseUrl={appBaseUrl}
              canManage={canManage}
              initialSettings={initialSettings}
              isDevMode={isDevMode}
            />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
