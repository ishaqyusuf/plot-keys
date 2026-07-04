import { createLoader, parseAsString } from "nuqs/server";

export const leaveRequestsFilterParams = {
  q: parseAsString,
  status: parseAsString,
};

export const loadLeaveRequestsFilterParams = createLoader(
  leaveRequestsFilterParams,
);

export type LeaveRequestsFilters = ReturnType<
  typeof loadLeaveRequestsFilterParams
>;
