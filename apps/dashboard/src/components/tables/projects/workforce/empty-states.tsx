import { Button } from "@plotkeys/ui/button";
import {
  CalendarDaysIcon,
  FolderKanban,
  UsersRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function ProjectWorkforceNotFoundState() {
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

export function ProjectWorkersEmptyState() {
  return (
    <div className="flex min-h-48 items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UsersRoundIcon className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No workers assigned</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add site labor once the project team is ready.
        </p>
      </div>
    </div>
  );
}

export function ProjectPayrollRunsEmptyState() {
  return (
    <div className="flex min-h-48 items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CalendarDaysIcon className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No payroll runs yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create payroll cycles as site work begins.
        </p>
      </div>
    </div>
  );
}
