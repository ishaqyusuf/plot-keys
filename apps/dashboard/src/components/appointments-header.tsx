import { AppointmentsColumnVisibility } from "@/components/appointments-column-visibility";
import { AppointmentsSearchFilter } from "@/components/appointments-search-filter";
import { AppointmentsStatusTabs } from "@/components/appointments-status-tabs";
import { OpenAppointmentSheet } from "@/components/open-appointment-sheet";

export function AppointmentsHeader() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <AppointmentsSearchFilter />

        <div className="flex items-center gap-2">
          <AppointmentsColumnVisibility />
          <div className="hidden sm:block">
            <OpenAppointmentSheet />
          </div>
        </div>
      </div>

      <AppointmentsStatusTabs />
    </div>
  );
}
