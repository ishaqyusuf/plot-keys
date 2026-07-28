import { parseAsBoolean, useQueryStates } from "nuqs";

export function useProjectParams() {
  const [params, setParams] = useQueryStates({
    createProject: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
