import { customersFilterParams } from "../lib/customers-filter-params";
import { useQueryFilterStates } from "../lib/use-filter-query-states";

export function useCustomersFilterParams() {
  const [filters, setFilters] = useQueryFilterStates(customersFilterParams);

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
