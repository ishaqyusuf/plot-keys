import { createLoader, parseAsString } from "nuqs/server";

export const payrollFilterParams = {
  q: parseAsString,
};

export const loadPayrollFilterParams = createLoader(payrollFilterParams);

export type PayrollFilters = ReturnType<typeof loadPayrollFilterParams>;
