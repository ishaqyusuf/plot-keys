"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useDepartmentsStore } from "@/store/departments";

export function DepartmentsColumnVisibility() {
  const { columns } = useDepartmentsStore();

  return <CoreColumnVisibility columns={columns} />;
}
