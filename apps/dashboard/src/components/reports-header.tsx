import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import type { ReportPeriod } from "@/components/reports/utils";

type Props = {
  month: number;
  periods: ReportPeriod[];
  year: number;
};

export function ReportsHeader({ month, periods, year }: Props) {
  return (
    <div className="flex items-center justify-end py-6">
      <HeaderLinkTabList>
        {periods.map((period) => {
          const active = period.year === year && period.month === month;

          return (
            <HeaderLinkTab
              active={active}
              href={`/reports?year=${period.year}&month=${period.month}`}
              key={`${period.year}-${period.month}`}
            >
              {period.label}
            </HeaderLinkTab>
          );
        })}
      </HeaderLinkTabList>
    </div>
  );
}
