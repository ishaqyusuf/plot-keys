import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useAgentParams() {
  const [params, setParams] = useQueryStates({
    agentId: parseAsString,
    createAgent: parseAsBoolean,
    inviteAgent: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
