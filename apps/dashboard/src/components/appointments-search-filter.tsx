"use client";

import {
  appointmentStatusConfig,
  appointmentStatuses,
} from "@/components/appointments/appointment-utils";
import { SearchFilter } from "@/components/search-filter/search-filter";
import type { PageFilterData } from "@/components/search-filter/types";
import { useAppointmentFilterParams } from "@/hooks/use-appointment-filter-params";

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
  {
    label: "Schedule",
    type: "date-range",
    value: "start",
  },
];

export function AppointmentsSearchFilter() {
  const { filter, setFilter } = useAppointmentFilterParams();

  return (
    <SearchFilter
      filterList={filterList}
      filters={filter}
      placeholder="Search appointments..."
      setFilters={(next) => setFilter(next as Parameters<typeof setFilter>[0])}
    />
  );
}
