import { loadQueryParams, parseAsString } from "./filter-query-loader";

export const propertiesFilterParams = {
  q: parseAsString,
  type: parseAsString,
};

export function loadPropertiesFilterParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return loadQueryParams(propertiesFilterParams, searchParams);
}

export type PropertiesFilters = ReturnType<typeof loadPropertiesFilterParams>;
