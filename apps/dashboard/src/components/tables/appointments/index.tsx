"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import {
  isAppointmentStatus,
  type AppointmentStatus,
} from "@/components/appointments/appointment-utils";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { useAppointmentsFilterParams } from "@/hooks/use-appointments-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import { AppointmentsEmptyState, AppointmentsNoResults } from "./empty-states";
import { AppointmentsDataTable } from "./table";
import { AppointmentsPageHeader } from "./table-header";

type AppointmentStats = Record<AppointmentStatus | "total", number>;

type AppointmentsTableProps = {
  initialSettings?: Partial<TableSettings>;
};

function normalizeStats(
  rows: Array<{ status: string; _count: number }>,
): AppointmentStats {
  const stats = {
    cancelled: 0,
    completed: 0,
    confirmed: 0,
    pending: 0,
    total: 0,
  };

  for (const row of rows) {
    if (isAppointmentStatus(row.status)) {
      stats[row.status] = row._count;
      stats.total += row._count;
    }
  }

  return stats;
}

export function AppointmentsTable({ initialSettings }: AppointmentsTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters, setFilters } = useAppointmentsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const statusParam = filters.status ?? undefined;
  const activeStatus: AppointmentStatus | undefined = isAppointmentStatus(
    statusParam,
  )
    ? statusParam
    : undefined;
  const showUpcoming = filters.view === "upcoming";
  const listInput = {
    q: deferredSearch,
    sort: params.sort,
    status: activeStatus,
    upcoming: showUpcoming || undefined,
  };
  const { data: statsRows } = useSuspenseQuery(
    trpc.workspace.getAppointmentStats.queryOptions(),
  );
  const infiniteQueryOptions =
    trpc.workspace.listAppointments.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const appointments = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const appointmentCount = data.pages[0]?.meta.count ?? appointments.length;
  const stats = normalizeStats(statsRows);

  return (
    <div className="flex flex-col gap-5">
      <AppointmentsPageHeader
        activeStatus={activeStatus}
        showUpcoming={showUpcoming}
        stats={stats}
      />

      {appointments.length ? (
        <DashboardTablePage>
          <AppointmentsDataTable
            appointments={appointments}
            appointmentCount={appointmentCount}
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
          />
        </DashboardTablePage>
      ) : hasFilters ? (
        <AppointmentsNoResults onClear={() => setFilters(null)} />
      ) : (
        <AppointmentsEmptyState />
      )}
    </div>
  );
}
