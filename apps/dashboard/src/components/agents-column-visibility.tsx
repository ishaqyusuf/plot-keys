"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useAgentsStore } from "@/store/agents";

export function AgentsColumnVisibility() {
  const { columns } = useAgentsStore();

  return <CoreColumnVisibility columns={columns} />;
}
