"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { usePropertiesStore } from "@/store/properties";

export function PropertiesColumnVisibility() {
  const { columns } = usePropertiesStore();

  return <CoreColumnVisibility columns={columns} />;
}
