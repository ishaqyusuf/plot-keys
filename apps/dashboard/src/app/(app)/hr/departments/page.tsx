import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DepartmentsHeader } from "@/components/departments-header";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/departments/data-table";
import { DepartmentsSkeleton } from "@/components/tables/departments/skeleton";
import {
  loadDepartmentsFilterParams,
  resolveDepartmentsListInput,
} from "@/hooks/use-departments-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Departments | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function DepartmentsPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadDepartmentsFilterParams(params);
  const { sort } = loadSortParams(params);
  const initialSettings = await getInitialTableSettings("departments");
  const listInput = resolveDepartmentsListInput(filters, sort);

  prefetch(
    trpc.departments.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
  );

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <DepartmentsHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<DepartmentsSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
