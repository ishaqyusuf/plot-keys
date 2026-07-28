"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useTeamMembersStore } from "@/store/team-members";

export function TeamMembersColumnVisibility() {
  const { columns } = useTeamMembersStore();

  return <CoreColumnVisibility columns={columns} />;
}
