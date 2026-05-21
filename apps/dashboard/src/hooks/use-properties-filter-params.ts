import { propertiesFilterParams } from "../lib/properties-filter-params";
import { useQueryFilterStates } from "../lib/use-filter-query-states";

export function usePropertiesFilterParams() {
  const [filters, setFilters] = useQueryFilterStates(propertiesFilterParams);

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
