import { parseAsBoolean, useQueryStates } from "nuqs";

export function useBuilderParams() {
  const [params, setParams] = useQueryStates({
    builderSettings: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
