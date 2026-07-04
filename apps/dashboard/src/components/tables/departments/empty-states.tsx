"use client";

import { Button } from "@plotkeys/ui/button";
import { FolderTree, SearchX } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

type DepartmentsNoResultsProps = {
  onClear: () => void;
};

export function DepartmentsEmptyState() {
  return (
    <DashboardEmptyState
      description="Create your first department to start structuring the workforce."
      icon={<FolderTree className="size-5" />}
      title="No departments yet"
    />
  );
}

export function DepartmentsNoResults({ onClear }: DepartmentsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No departments found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current department search.
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
