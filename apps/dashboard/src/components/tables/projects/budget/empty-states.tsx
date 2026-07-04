import { Button } from "@plotkeys/ui/button";
import { CircleDollarSign, FolderKanban } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function ProjectBudgetNotFoundState() {
  return (
    <DashboardEmptyState
      actions={
        <Button asChild>
          <Link href="/projects">Back to projects</Link>
        </Button>
      }
      description="This project may have been deleted, archived outside this workspace, or opened from an old link."
      icon={<FolderKanban className="size-5" />}
      title="Project not found"
    />
  );
}

export function BudgetLineItemsEmptyState() {
  return (
    <div className="flex min-h-48 items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CircleDollarSign className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No line items yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add BOQ items once a project budget has been created.
        </p>
      </div>
    </div>
  );
}
