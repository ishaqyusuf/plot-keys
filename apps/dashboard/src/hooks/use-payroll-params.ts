import { parseAsBoolean, useQueryStates } from "nuqs";

export function usePayrollParams() {
  const [params, setParams] = useQueryStates({
    createPayrollEntry: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
