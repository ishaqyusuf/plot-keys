import { loadQueryParams, parseAsString } from "./filter-query-loader";

export const customersFilterParams = {
  filter: parseAsString,
  q: parseAsString,
};

export function loadCustomersFilterParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return loadQueryParams(customersFilterParams, searchParams);
}

export type CustomersFilters = ReturnType<typeof loadCustomersFilterParams>;
