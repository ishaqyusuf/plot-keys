"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useCustomersStore } from "@/store/customers";

export function CustomersColumnVisibility() {
  const { columns } = useCustomersStore();

  return <CoreColumnVisibility columns={columns} />;
}
