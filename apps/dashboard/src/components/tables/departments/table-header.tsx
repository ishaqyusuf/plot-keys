"use client";

import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import {
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
import { DepartmentsColumnVisibility } from "@/components/departments-column-visibility";
import { DepartmentSheet } from "@/components/sheets/department-sheet";
import { DepartmentsSearchFilter } from "./search-filter";

type DepartmentsPageHeaderProps = {
  departmentCount: number;
};

type DepartmentsTableHeaderProps = {
  departmentCount: number;
};

export function DepartmentsPageHeader({
  departmentCount,
}: DepartmentsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Departments</DashboardPageTitle>
          <DashboardPageDescription>
            Organize team structure and keep employee assignment views aligned.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <DepartmentSheet />
          <Button asChild size="sm" variant="outline">
            <Link href="/hr/employees">Back to employees</Link>
          </Button>
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {departmentCount} department{departmentCount !== 1 ? "s" : ""} total
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function DepartmentsTableHeader({
  departmentCount,
}: DepartmentsTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Department list</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Review headcount and jump into department-filtered employee views.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <DepartmentsColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <DepartmentsSearchFilter />
        <span className="text-sm text-muted-foreground">
          {departmentCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
