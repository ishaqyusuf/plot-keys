"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useEmployeesStore } from "@/store/employees";

export function EmployeesColumnVisibility() {
  const { columns } = useEmployeesStore();

  return <CoreColumnVisibility columns={columns} />;
}
