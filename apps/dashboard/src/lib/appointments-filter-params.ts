import { createLoader, parseAsString } from "nuqs/server";

export const appointmentsFilterParams = {
  q: parseAsString,
  status: parseAsString,
  view: parseAsString,
};

export const loadAppointmentsFilterParams = createLoader(
  appointmentsFilterParams,
);

export type AppointmentsFilters = ReturnType<
  typeof loadAppointmentsFilterParams
>;
