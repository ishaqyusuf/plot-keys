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
import { AppointmentsColumnVisibility } from "@/components/appointments-column-visibility";
import { ExportCsvButton } from "@/components/export-csv-button";
import { AppointmentSheet } from "@/components/sheets/appointment-sheet";
import { exportAppointmentsCsvAction } from "@/app/actions";
import { AppointmentsSearchFilter } from "./search-filter";
import {
  appointmentStatuses,
  appointmentStatusConfig,
  type AppointmentStatus,
} from "@/components/appointments/appointment-utils";

type AppointmentStats = Record<AppointmentStatus | "total", number>;

type AppointmentsPageHeaderProps = {
  activeStatus?: AppointmentStatus;
  showUpcoming: boolean;
  stats: AppointmentStats;
};

type AppointmentsTableHeaderProps = {
  appointmentCount: number;
};

export function AppointmentsPageHeader({
  activeStatus,
  showUpcoming,
  stats,
}: AppointmentsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Scheduling workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Appointments</DashboardPageTitle>
          <DashboardPageDescription>
            Run viewings and customer meetings with a clearer schedule board
            and standardized follow-up controls.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <AppointmentSheet />
          <ExportCsvButton
            exportAction={exportAppointmentsCsvAction}
            filename="appointments.csv"
          />
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {stats.total} appointment{stats.total !== 1 ? "s" : ""} total
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab
              active={!activeStatus && !showUpcoming}
              href="/appointments"
            >
              All ({stats.total})
            </DashboardFilterTab>
            <DashboardFilterTab
              active={showUpcoming}
              href="/appointments?view=upcoming"
            >
              Upcoming
            </DashboardFilterTab>
            {appointmentStatuses.map((status) => (
              <DashboardFilterTab
                active={activeStatus === status}
                href={`/appointments?status=${status}`}
                key={status}
              >
                {appointmentStatusConfig[status].label} ({stats[status] ?? 0})
              </DashboardFilterTab>
            ))}
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function AppointmentsTableHeader({
  appointmentCount,
}: AppointmentsTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Appointment queue</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Stay on top of upcoming, confirmed, completed, and cancelled
            appointments in one timeline.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <AppointmentsColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <AppointmentsSearchFilter />
        <span className="text-sm text-muted-foreground">
          {appointmentCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
