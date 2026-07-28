"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { usePayrollStore } from "@/store/payroll";

export function PayrollColumnVisibility() {
  const { columns } = usePayrollStore();

  return <CoreColumnVisibility columns={columns} />;
}
