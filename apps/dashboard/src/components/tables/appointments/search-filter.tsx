"use client";

import { DashboardSearchFilter } from "@/components/search-filter/dashboard-search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useAppointmentsFilterParams } from "@/hooks/use-appointments-filter-params";
import {
  appointmentStatusConfig,
  appointmentStatuses,
} from "@/components/appointments/appointment-utils";

const filterList: PageFilterData[] = [
  {
    label: "Search",
    type: "input",
    value: "q",
  },
  {
    label: "Status",
    options: appointmentStatuses.map((status) => ({
      label: appointmentStatusConfig[status].label,
      value: status,
    })),
    type: "select",
    value: "status",
  },
];

export function AppointmentsSearchFilter() {
  const { filters, setFilters } = useAppointmentsFilterParams();

  return (
    <DashboardSearchFilter
      filterList={filterList}
      filters={filters}
      placeholder="Search appointments..."
      setFilters={(next) =>
        setFilters(next as Parameters<typeof setFilters>[0])
      }
    />
  );
}
