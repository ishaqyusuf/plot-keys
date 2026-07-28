import { parseAsBoolean, useQueryStates } from "nuqs";

export function useTeamParams() {
  const [params, setParams] = useQueryStates({
    inviteMember: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
