"use client";

import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import { exportEmployeesCsvAction } from "@/app/actions";
import { EmployeesColumnVisibility } from "@/components/employees-column-visibility";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardTableFilters,
  DashboardTableHeaderTop,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";
import { ExportCsvButton } from "@/components/export-csv-button";
import { InviteEmployeeSheet } from "@/components/sheets/invite-employee-sheet";
import { EmployeesSearchFilter } from "./search-filter";
import {
  employeeStatuses,
  employeeStatusConfig,
  type EmployeeStatus,
} from "@/components/employees/employee-utils";

type EmployeeStats = Record<EmployeeStatus | "total", number>;

type EmployeesPageHeaderProps = {
  activeStatus?: EmployeeStatus;
  canManage: boolean;
  departmentId?: string;
  stats: EmployeeStats;
};

type EmployeesTableHeaderProps = {
  employeeCount: number;
};

export function EmployeesPageHeader({
  activeStatus,
  canManage,
  departmentId,
  stats,
}: EmployeesPageHeaderProps) {
  const getHref = (status?: EmployeeStatus) => {
    const params = new URLSearchParams();

    if (status) {
      params.set("status", status);
    }

    if (departmentId) {
      params.set("department", departmentId);
    }

    const query = params.toString();
    return query ? `/hr/employees?${query}` : "/hr/employees";
  };

  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Employees</DashboardPageTitle>
          <DashboardPageDescription>
            Manage employee lifecycle, invite flows, and workforce structure
            from a unified workforce dashboard.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          {canManage ? <InviteEmployeeSheet /> : null}
          <Button asChild size="sm" variant="outline">
            <Link href="/hr/departments">Departments</Link>
          </Button>
          <ExportCsvButton
            exportAction={exportEmployeesCsvAction}
            filename="employees.csv"
          />
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {stats.total} employee{stats.total !== 1 ? "s" : ""} total
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab active={!activeStatus} href={getHref()}>
              All ({stats.total})
            </DashboardFilterTab>
            {employeeStatuses.map((status) => (
              <DashboardFilterTab
                active={activeStatus === status}
                href={getHref(status)}
                key={status}
              >
                {employeeStatusConfig[status].label} ({stats[status] ?? 0})
              </DashboardFilterTab>
            ))}
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function EmployeesTableHeader({
  employeeCount,
}: EmployeesTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Employee roster</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Review status, role, department, and quick actions in a single
            roster.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <EmployeesColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <EmployeesSearchFilter />
        <span className="text-sm text-muted-foreground">
          {employeeCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
