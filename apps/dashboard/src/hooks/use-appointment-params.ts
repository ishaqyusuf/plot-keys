import { parseAsBoolean, useQueryStates } from "nuqs";

export function useAppointmentParams() {
  const [params, setParams] = useQueryStates({
    createAppointment: parseAsBoolean,
  });

  return {
    ...params,
    setParams,
  };
}
