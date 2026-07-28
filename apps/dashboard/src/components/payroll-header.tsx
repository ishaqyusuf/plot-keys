import { OpenPayrollEntrySheet } from "@/components/open-payroll-entry-sheet";
import { PayrollColumnVisibility } from "@/components/payroll-column-visibility";
import { PayrollPeriodTabs } from "@/components/payroll-period-tabs";
import { SearchField } from "@/components/search-field";

type Props = {
  periodMonth: number;
  periodYear: number;
};

export function PayrollHeader({ periodMonth, periodYear }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SearchField placeholder="Search payroll" />

        <div className="flex items-center gap-2">
          <PayrollColumnVisibility />
          <div className="hidden sm:block">
            <OpenPayrollEntrySheet />
          </div>
        </div>
      </div>

      <PayrollPeriodTabs periodMonth={periodMonth} periodYear={periodYear} />
    </div>
  );
}
