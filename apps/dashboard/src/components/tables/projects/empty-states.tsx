"use client";

import { Button } from "@plotkeys/ui/button";
import { FolderKanban, SearchX } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { ProjectSheet } from "@/components/sheets/project-sheet";
import { projectStatusConfig, type ProjectStatus } from "@/components/projects/project-utils";

type ProjectsEmptyStateProps = {
  activeStatus?: ProjectStatus;
};

type ProjectsNoResultsProps = {
  onClear: () => void;
};

export function ProjectsEmptyState({ activeStatus }: ProjectsEmptyStateProps) {
  const statusLabel = activeStatus
    ? projectStatusConfig[activeStatus].label.toLowerCase()
    : null;

  return (
    <DashboardEmptyState
      actions={activeStatus ? null : <ProjectSheet />}
      description={
        statusLabel
          ? `No ${statusLabel} projects yet.`
          : "Create your first project to start tracking delivery."
      }
      icon={<FolderKanban className="size-5" />}
      title="Nothing in the pipeline"
    />
  );
}

export function ProjectsNoResults({ onClear }: ProjectsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No projects found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current project search.
        </p>
        <Button
          className="mt-4"
          onClick={onClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}
