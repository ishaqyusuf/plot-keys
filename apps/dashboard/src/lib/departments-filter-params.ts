import { createLoader, parseAsString } from "nuqs/server";

export const departmentsFilterParams = {
  q: parseAsString,
};

export const loadDepartmentsFilterParams = createLoader(
  departmentsFilterParams,
);

export type DepartmentsFilters = ReturnType<typeof loadDepartmentsFilterParams>;
