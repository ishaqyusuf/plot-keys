import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { DepartmentsTable } from "@/components/tables/departments";
import { DepartmentsSkeleton } from "@/components/tables/departments/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadDepartmentsFilterParams } from "@/lib/departments-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Departments | Plot Keys",
};

type DepartmentsPageProps = {
  searchParams?: Promise<
    SearchParams & {
      created?: string;
      error?: string;
      q?: string;
      sort?: string | string[];
    }
  >;
};

export default async function DepartmentsPage({
  searchParams,
}: DepartmentsPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadDepartmentsFilterParams(params);
  const { sort } = loadSortParams(params);
  const initialSettings = await getInitialTableSettings("departments");
  const listInput = { q: filters.q, sort };

  batchPrefetch([
    trpc.workspace.listDepartments.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
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
          <AlertDescription>Department added.</AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<DepartmentsSkeleton />}>
            <DepartmentsTable initialSettings={initialSettings} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
