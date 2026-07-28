"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";
import { monthNames } from "@/components/payroll/payroll-utils";
import { useTRPC } from "@/trpc/client";

type Props = {
  periodMonth: number;
  periodYear: number;
};

export function PayrollPeriodTabs({ periodMonth, periodYear }: Props) {
  const trpc = useTRPC();
  const { data: periods } = useSuspenseQuery(
    trpc.payroll.periods.queryOptions(),
  );

  if (!periods.length) {
    return null;
  }

  return (
    <HeaderLinkTabList>
      {periods.map((period) => {
        const isActive =
          period.periodYear === periodYear &&
          period.periodMonth === periodMonth;

        return (
          <HeaderLinkTab
            active={isActive}
            href={`/hr/payroll?year=${period.periodYear}&month=${period.periodMonth}`}
            key={`${period.periodYear}-${period.periodMonth}`}
          >
            {monthNames[period.periodMonth - 1]?.slice(0, 3)}{" "}
            {period.periodYear}
          </HeaderLinkTab>
        );
      })}
    </HeaderLinkTabList>
  );
}
