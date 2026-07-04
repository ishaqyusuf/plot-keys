"use client";

import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
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
import { PayrollColumnVisibility } from "@/components/payroll-column-visibility";
import { PayrollEntrySheet } from "@/components/sheets/payroll-entry-sheet";
import { PayrollSearchFilter } from "./search-filter";
import { formatPayrollPeriod, monthNames } from "@/components/payroll/payroll-utils";

type PayrollPeriod = {
  periodMonth: number;
  periodYear: number;
};

type PayrollPageHeaderProps = {
  periodMonth: number;
  periods: PayrollPeriod[];
  periodYear: number;
};

type PayrollTableHeaderProps = {
  entryCount: number;
};

export function PayrollPageHeader({
  periodMonth,
  periods,
  periodYear,
}: PayrollPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>People workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Payroll</DashboardPageTitle>
          <DashboardPageDescription>
            Manage payroll periods, entries, and payment status from the people
            workspace.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <PayrollEntrySheet
            periodMonth={periodMonth}
            periodYear={periodYear}
          />
          <Button asChild size="sm" variant="outline">
            <Link href="/hr/employees">Back to employees</Link>
          </Button>
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {formatPayrollPeriod(periodYear, periodMonth)}
        </DashboardToolbarGroup>
        {periods.length ? (
          <DashboardToolbarGroup>
            <DashboardFilterTabs>
              {periods.map((period) => {
                const isActive =
                  period.periodYear === periodYear &&
                  period.periodMonth === periodMonth;

                return (
                  <DashboardFilterTab
                    active={isActive}
                    href={`/hr/payroll?year=${period.periodYear}&month=${period.periodMonth}`}
                    key={`${period.periodYear}-${period.periodMonth}`}
                  >
                    {monthNames[period.periodMonth - 1]?.slice(0, 3)}{" "}
                    {period.periodYear}
                  </DashboardFilterTab>
                );
              })}
            </DashboardFilterTabs>
          </DashboardToolbarGroup>
        ) : null}
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function PayrollTableHeader({ entryCount }: PayrollTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Period ledger</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Review payroll entries, amounts, and payment status for the active
            period.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <PayrollColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <PayrollSearchFilter />
        <span className="text-sm text-muted-foreground">
          {entryCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
