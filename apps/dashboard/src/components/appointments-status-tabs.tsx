"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  type AppointmentStatus,
  appointmentStatusConfig,
  appointmentStatuses,
  isAppointmentStatus,
} from "@/components/appointments/appointment-utils";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import { useAppointmentFilterParams } from "@/hooks/use-appointment-filter-params";
import { useTRPC } from "@/trpc/client";

type AppointmentStats = Record<AppointmentStatus | "total", number>;

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

export function AppointmentsStatusTabs() {
  const trpc = useTRPC();
  const { filter } = useAppointmentFilterParams();
  const statusParam = filter.status ?? undefined;
  const activeStatus: AppointmentStatus | undefined = isAppointmentStatus(
    statusParam,
  )
    ? statusParam
    : undefined;
  const showUpcoming = filter.view === "upcoming";
  const { data: statsRows } = useSuspenseQuery(
    trpc.appointments.stats.queryOptions(),
  );
  const stats = normalizeStats(statsRows);

  return (
    <HeaderLinkTabList>
      <HeaderLinkTab
        active={!activeStatus && !showUpcoming}
        href="/appointments"
      >
        All ({stats.total})
      </HeaderLinkTab>
      <HeaderLinkTab active={showUpcoming} href="/appointments?view=upcoming">
        Upcoming
      </HeaderLinkTab>
      {appointmentStatuses.map((status) => (
        <HeaderLinkTab
          active={activeStatus === status}
          href={`/appointments?status=${status}`}
          key={status}
        >
          {appointmentStatusConfig[status].label} ({stats[status] ?? 0})
        </HeaderLinkTab>
      ))}
    </HeaderLinkTabList>
  );
}
