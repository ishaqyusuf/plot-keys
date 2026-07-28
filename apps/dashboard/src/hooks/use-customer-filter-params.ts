import { useQueryStates } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const customerFilterParamsSchema = {
  end: parseAsString,
  filter: parseAsString,
  q: parseAsString,
  sort: parseAsArrayOf(parseAsString),
  start: parseAsString,
};

export function useCustomerFilterParams() {
  const [filter, setFilter] = useQueryStates(customerFilterParamsSchema);

  return {
    filter,
    setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}

export const loadCustomerFilterParams = createLoader(
  customerFilterParamsSchema,
);

export type CustomerFilters = Awaited<
  ReturnType<typeof loadCustomerFilterParams>
>;
type CustomerSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type CustomerListInputOptions = {
  q?: string | null;
};

export function resolveCustomerListInput(
  filters: CustomerFilters,
  sort: CustomerSort,
  options: CustomerListInputOptions = {},
) {
  return {
    ...filters,
    q: options.q ?? filters.q,
    sort,
  };
}
