"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useProjectsStore } from "@/store/projects";

export function ProjectsColumnVisibility() {
  const { columns } = useProjectsStore();

  return <CoreColumnVisibility columns={columns} />;
}
