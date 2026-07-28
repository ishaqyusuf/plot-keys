"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useAppointmentsStore } from "@/store/appointments";

export function AppointmentsColumnVisibility() {
  const { columns } = useAppointmentsStore();

  return <CoreColumnVisibility columns={columns} />;
}
