"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useLeadsStore } from "@/store/leads";

export function LeadsColumnVisibility() {
  const { columns } = useLeadsStore();

  return <CoreColumnVisibility columns={columns} />;
}
