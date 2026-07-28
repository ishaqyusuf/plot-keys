"use client";

import { Button } from "@plotkeys/ui/button";
import {
  type ProjectStatus,
  projectStatusConfig,
} from "@/components/projects/project-utils";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useProjectParams } from "@/hooks/use-project-params";
import { useProjectsFilterParams } from "@/hooks/use-projects-filter-params";

type Props = {
  activeStatus?: ProjectStatus;
};

export function EmptyState({ activeStatus }: Props) {
  const { setParams } = useProjectParams();
  const statusLabel = activeStatus
    ? projectStatusConfig[activeStatus].label.toLowerCase()
    : null;

  return (
    <CoreEmptyState
      action={
        activeStatus ? null : (
          <Button
            variant="outline"
            onClick={() => setParams({ createProject: true })}
          >
            Create project
          </Button>
        )
      }
      description={
        statusLabel
          ? `No ${statusLabel} projects yet.`
          : "Create your first project to start tracking delivery."
      }
      title="Nothing in the pipeline"
    />
  );
}

export function NoResults() {
  const { setFilters } = useProjectsFilterParams();

  return <CoreNoResults onClear={() => setFilters(null)} />;
}
