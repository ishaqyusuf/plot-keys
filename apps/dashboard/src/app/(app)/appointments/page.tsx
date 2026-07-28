import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { AppointmentsHeader } from "@/components/appointments-header";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/appointments/data-table";
import { AppointmentsSkeleton } from "@/components/tables/appointments/skeleton";
import {
  loadAppointmentFilterParams,
  resolveAppointmentListInput,
} from "@/hooks/use-appointment-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Appointments | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function AppointmentsPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadAppointmentFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveAppointmentListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("appointments");

  batchPrefetch([
    trpc.appointments.stats.queryOptions(),
    trpc.appointments.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    trpc.agents.list.queryOptions({ size: 100 }),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <AppointmentsHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<AppointmentsSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
