"use client";

import { Button } from "@plotkeys/ui/button";
import { SearchX, UsersRound } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { employeeStatusConfig, type EmployeeStatus } from "@/components/employees/employee-utils";

type EmployeesEmptyStateProps = {
  activeStatus?: EmployeeStatus;
  departmentId?: string;
};

type EmployeesNoResultsProps = {
  onClear: () => void;
};

export function EmployeesEmptyState({
  activeStatus,
  departmentId,
}: EmployeesEmptyStateProps) {
  return (
    <DashboardEmptyState
      description={
        activeStatus
          ? `No ${employeeStatusConfig[activeStatus].label.toLowerCase()} employees found.`
          : departmentId
            ? "No employees are assigned to this department yet."
          : "Invite your first employee to start building the roster."
      }
      icon={<UsersRound className="size-5" />}
      title="No employees yet"
    />
  );
}

export function EmployeesNoResults({ onClear }: EmployeesNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No employees found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current employee search.
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
