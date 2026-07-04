"use client";

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
import { LeadsColumnVisibility } from "@/components/leads-column-visibility";
import { exportLeadsCsvAction } from "@/app/actions";
import { LeadsSearchFilter } from "./search-filter";
import { leadStatuses, leadStatusConfig, type LeadStatus } from "@/components/leads/lead-utils";

type LeadStats = Record<LeadStatus | "total", number>;

type LeadsPageHeaderProps = {
  activeStatus?: LeadStatus;
  stats: LeadStats;
};

type LeadsTableHeaderProps = {
  leadCount: number;
};

export function LeadsPageHeader({
  activeStatus,
  stats,
}: LeadsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Acquisition workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Leads</DashboardPageTitle>
          <DashboardPageDescription>
            Review inbound demand, move lead status forward, and convert
            qualified prospects into customers.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <ExportCsvButton
            exportAction={exportLeadsCsvAction}
            filename="leads.csv"
          />
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {stats.total} lead{stats.total !== 1 ? "s" : ""} captured
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab active={!activeStatus} href="/leads">
              All ({stats.total})
            </DashboardFilterTab>
            {leadStatuses.map((status) => (
              <DashboardFilterTab
                active={activeStatus === status}
                href={`/leads?status=${status}`}
                key={status}
              >
                {leadStatusConfig[status].label} ({stats[status] ?? 0})
              </DashboardFilterTab>
            ))}
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function LeadsTableHeader({ leadCount }: LeadsTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Lead queue</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Work from newest demand first and move each record through a
            consistent follow-up flow.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <LeadsColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <LeadsSearchFilter />
        <span className="text-sm text-muted-foreground">{leadCount} total</span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
