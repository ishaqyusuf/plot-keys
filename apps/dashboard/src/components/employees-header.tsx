import { EmployeesColumnVisibility } from "@/components/employees-column-visibility";
import { EmployeesSearchFilter } from "@/components/employees-search-filter";
import { EmployeesStatusTabs } from "@/components/employees-status-tabs";
import { OpenInviteEmployeeSheet } from "@/components/open-invite-employee-sheet";

type Props = {
  canManage: boolean;
};

export function EmployeesHeader({ canManage }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <EmployeesSearchFilter />

        <div className="flex items-center gap-2">
          <EmployeesColumnVisibility />
          {canManage ? (
            <div className="hidden sm:block">
              <OpenInviteEmployeeSheet />
            </div>
          ) : null}
        </div>
      </div>

      <EmployeesStatusTabs />
    </div>
  );
}
