import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

export function ProjectWorkforceNotFoundState() {
  return (
    <div className="flex min-h-56 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <h3 className="font-medium text-foreground">Project not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This project may have been deleted, archived outside this workspace,
          or opened from an old link.
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/projects">Back to projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectWorkersEmptyState() {
  return (
    <div className="flex min-h-48 items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
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
        <h3 className="font-medium text-foreground">No payroll runs yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create payroll cycles as site work begins.
        </p>
      </div>
    </div>
  );
}
