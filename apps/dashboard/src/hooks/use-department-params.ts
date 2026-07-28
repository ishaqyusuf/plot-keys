import { parseAsBoolean, useQueryStates } from "nuqs";

export function useDepartmentParams() {
  const [params, setParams] = useQueryStates({
    createDepartment: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
