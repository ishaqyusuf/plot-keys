import { parseAsBoolean, useQueryStates } from "nuqs";

export function useLeaveRequestParams() {
  const [params, setParams] = useQueryStates({
    createLeaveRequest: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
