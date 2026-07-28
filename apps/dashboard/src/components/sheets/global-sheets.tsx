"use client";

import { SearchModal } from "@/components/search/search-modal";
import { AgentCreateSheet } from "@/components/sheets/agent-create-sheet";
import { AgentEditSheet } from "@/components/sheets/agent-edit-sheet";
import { AgentInviteSheet } from "@/components/sheets/agent-invite-sheet";
import { AppointmentCreateSheet } from "@/components/sheets/appointment-create-sheet";
import { CustomerCreateSheet } from "@/components/sheets/customer-create-sheet";
import { CustomerDetailsSheet } from "@/components/sheets/customer-details-sheet";
import { CustomerEditSheet } from "@/components/sheets/customer-edit-sheet";
import { DepartmentCreateSheet } from "@/components/sheets/department-create-sheet";
import { EmployeeInviteSheet } from "@/components/sheets/employee-invite-sheet";
import { EstateCreateSheet } from "@/components/sheets/estate-create-sheet";
import { EstateLaunchDetailsSheet } from "@/components/sheets/estate-launch-details-sheet";
import { LeaveRequestCreateSheet } from "@/components/sheets/leave-request-create-sheet";
import { PayrollEntryCreateSheet } from "@/components/sheets/payroll-entry-create-sheet";
import { ProjectCreateSheet } from "@/components/sheets/project-create-sheet";
import { PropertyCreateSheet } from "@/components/sheets/property-create-sheet";
import { PropertyDetailsSheet } from "@/components/sheets/property-details-sheet";
import { PropertyEditSheet } from "@/components/sheets/property-edit-sheet";
import { TeamInviteSheet } from "@/components/sheets/team-invite-sheet";

export function GlobalSheets() {
  return (
    <>
      <AgentCreateSheet />
      <AgentEditSheet />
      <AgentInviteSheet />
      <AppointmentCreateSheet />
      <CustomerCreateSheet />
      <CustomerDetailsSheet />
      <CustomerEditSheet />
      <DepartmentCreateSheet />
      <EmployeeInviteSheet />
      <EstateCreateSheet />
      <EstateLaunchDetailsSheet />
      <LeaveRequestCreateSheet />
      <PayrollEntryCreateSheet />
      <PropertyCreateSheet />
      <PropertyDetailsSheet />
      <PropertyEditSheet />
      <ProjectCreateSheet />
      <SearchModal />
      <TeamInviteSheet />
    </>
  );
}
