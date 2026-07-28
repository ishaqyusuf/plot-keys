import { parseAsBoolean, useQueryStates } from "nuqs";

export function useEmployeeParams() {
  const [params, setParams] = useQueryStates({
    inviteEmployee: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
