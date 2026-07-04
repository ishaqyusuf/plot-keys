import { createLoader, parseAsString } from "nuqs/server";

export const teamFilterParams = {
  q: parseAsString,
};

export const loadTeamFilterParams = createLoader(teamFilterParams);

export type TeamFilters = ReturnType<typeof loadTeamFilterParams>;
