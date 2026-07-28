import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function usePropertyParams() {
  const [params, setParams] = useQueryStates({
    propertyId: parseAsString,
    createProperty: parseAsBoolean,
    estateId: parseAsString,
    propertyLocation: parseAsString,
    propertyType: parseAsString,
    returnTo: parseAsString,
    details: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
