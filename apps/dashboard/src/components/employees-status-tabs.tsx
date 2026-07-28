"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  type EmployeeStatus,
  employeeStatusConfig,
  employeeStatuses,
  isEmployeeStatus,
} from "@/components/employees/employee-utils";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import { useEmployeesFilterParams } from "@/hooks/use-employees-filter-params";
import { useTRPC } from "@/trpc/client";

export function EmployeesStatusTabs() {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(trpc.employees.stats.queryOptions());
  const { filter } = useEmployeesFilterParams();
  const departmentId = filter.department?.trim() || undefined;
  const statusParam = filter.status ?? undefined;
  const activeStatus = isEmployeeStatus(statusParam) ? statusParam : undefined;

  return (
    <HeaderLinkTabList>
      <HeaderLinkTab
        active={!activeStatus}
        href={getStatusHref(undefined, departmentId)}
      >
        All ({stats.total})
      </HeaderLinkTab>
      {employeeStatuses.map((status) => (
        <HeaderLinkTab
          active={activeStatus === status}
          href={getStatusHref(status, departmentId)}
          key={status}
        >
          {employeeStatusConfig[status].label} ({stats[status] ?? 0})
        </HeaderLinkTab>
      ))}
    </HeaderLinkTabList>
  );
}

function getStatusHref(status?: EmployeeStatus, departmentId?: string) {
  const params = new URLSearchParams();

  if (status) {
    params.set("status", status);
  }

  if (departmentId) {
    params.set("department", departmentId);
  }

  const query = params.toString();
  return query ? `/hr/employees?${query}` : "/hr/employees";
}
