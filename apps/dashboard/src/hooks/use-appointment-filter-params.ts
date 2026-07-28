"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { isAppointmentStatus } from "@/components/appointments/appointment-utils";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const appointmentFilterParamsSchema = {
  end: parseAsString,
  q: parseAsString,
  start: parseAsString,
  status: parseAsString,
  view: parseAsString,
};

export function useAppointmentFilterParams() {
  const [filter, setFilter] = useQueryStates(appointmentFilterParamsSchema);

  return {
    filter,
    setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}

export const loadAppointmentFilterParams = createLoader(
  appointmentFilterParamsSchema,
);

export type AppointmentFilters = Awaited<
  ReturnType<typeof loadAppointmentFilterParams>
>;
type AppointmentSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type AppointmentListInputOptions = {
  q?: string | null;
};

export function resolveAppointmentListInput(
  filters: AppointmentFilters,
  sort: AppointmentSort,
  options: AppointmentListInputOptions = {},
) {
  const statusParam = filters.status ?? undefined;
  const status = isAppointmentStatus(statusParam) ? statusParam : undefined;
  const showUpcoming = filters.view === "upcoming";

  return {
    end: filters.end,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
    status,
    upcoming: showUpcoming || undefined,
  };
}
