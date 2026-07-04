import { createLoader, parseAsString } from "nuqs/server";

export const employeesFilterParams = {
  department: parseAsString,
  q: parseAsString,
  status: parseAsString,
};

export const loadEmployeesFilterParams = createLoader(employeesFilterParams);

export type EmployeesFilters = ReturnType<typeof loadEmployeesFilterParams>;
