"use client";

import {
  type EmployeeStatus,
  employeeStatusConfig,
} from "@/components/employees/employee-utils";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useEmployeesFilterParams } from "@/hooks/use-employees-filter-params";

type Props = {
  activeStatus?: EmployeeStatus;
  departmentId?: string;
};

export function EmptyState({ activeStatus, departmentId }: Props) {
  return (
    <CoreEmptyState
      description={
        activeStatus
          ? `No ${employeeStatusConfig[activeStatus].label.toLowerCase()} employees found.`
          : departmentId
            ? "No employees are assigned to this department yet."
            : "Invite your first employee to start building the roster."
      }
      title="No employees yet"
    />
  );
}

export function NoResults() {
  const { setFilters } = useEmployeesFilterParams();

  return <CoreNoResults onClear={() => setFilters(null)} />;
}
