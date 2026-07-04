import { createLoader, parseAsString } from "nuqs/server";

export const agentsFilterParams = {
  q: parseAsString,
};

export const loadAgentsFilterParams = createLoader(agentsFilterParams);

export type AgentsFilters = ReturnType<typeof loadAgentsFilterParams>;
