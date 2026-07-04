import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { isAppointmentStatus } from "@/components/appointments/appointment-utils";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { AppointmentsTable } from "@/components/tables/appointments";
import { AppointmentsSkeleton } from "@/components/tables/appointments/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadAppointmentsFilterParams } from "@/lib/appointments-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Appointments | Plot Keys",
};

type AppointmentsPageProps = {
  searchParams?: Promise<
    SearchParams & {
      q?: string;
      sort?: string | string[];
      status?: string;
      view?: string;
    }
  >;
};

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const params = (await searchParams) ?? {};
  await requireOnboardedSession();
  const filters = loadAppointmentsFilterParams(params);
  const { sort } = loadSortParams(params);
  const statusParam = filters.status ?? undefined;
  const status = isAppointmentStatus(statusParam)
    ? statusParam
    : undefined;
  const showUpcoming = filters.view === "upcoming";
  const listInput = {
    q: filters.q,
    sort,
    status,
    upcoming: showUpcoming || undefined,
  };
  const initialSettings = await getInitialTableSettings("appointments");

  batchPrefetch([
    trpc.workspace.getAppointmentStats.queryOptions(),
    trpc.workspace.listAppointments.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    trpc.workspace.listAgents.queryOptions({ size: 100 }),
  ]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<AppointmentsSkeleton />}>
            <AppointmentsTable initialSettings={initialSettings} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
