import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useEstateParams() {
  const [params, setParams] = useQueryStates({
    estateSlug: parseAsString,
    createEstate: parseAsBoolean,
    editEstateLaunch: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
