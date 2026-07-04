import { createLoader, parseAsString } from "nuqs/server";

export const customersFilterParams = {
  filter: parseAsString,
  q: parseAsString,
};

export const loadCustomersFilterParams = createLoader(customersFilterParams);

export type CustomersFilters = ReturnType<typeof loadCustomersFilterParams>;
