import { createLoader, parseAsString } from "nuqs/server";

export const leadsFilterParams = {
  q: parseAsString,
  status: parseAsString,
};

export const loadLeadsFilterParams = createLoader(leadsFilterParams);

export type LeadsFilters = ReturnType<typeof loadLeadsFilterParams>;
