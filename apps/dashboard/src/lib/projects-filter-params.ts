import { createLoader, parseAsString } from "nuqs/server";

export const projectsFilterParams = {
  q: parseAsString,
  status: parseAsString,
};

export const loadProjectsFilterParams = createLoader(projectsFilterParams);

export type ProjectsFilters = ReturnType<typeof loadProjectsFilterParams>;
