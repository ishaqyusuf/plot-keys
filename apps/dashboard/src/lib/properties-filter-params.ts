import { createLoader, parseAsString } from "nuqs/server";

export const propertiesFilterParams = {
  q: parseAsString,
  type: parseAsString,
};

export const loadPropertiesFilterParams = createLoader(propertiesFilterParams);

export type PropertiesFilters = ReturnType<typeof loadPropertiesFilterParams>;
