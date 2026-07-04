import {
  CrownIcon,
  UserCheckIcon,
  UserMinusIcon,
  UsersIcon,
} from "lucide-react";
import {
  DashboardStatCard,
  DashboardStatGrid,
} from "@/components/dashboard/dashboard-page";

type CustomerStats = Record<string, number>;

type CustomersSummaryProps = {
  stats: CustomerStats;
};

export function CustomersSummary({ stats }: CustomersSummaryProps) {
  const active = stats.active ?? 0;
  const inactive = stats.inactive ?? 0;
  const vip = stats.vip ?? 0;
  const total = active + inactive + vip;

  return (
    <DashboardStatGrid>
      <DashboardStatCard
        icon={UsersIcon}
        label="Total customers"
        value={total}
      />
      <DashboardStatCard
        href="/customers?filter=active"
        icon={UserCheckIcon}
        label="Active"
        value={active}
      />
      <DashboardStatCard
        href="/customers?filter=vip"
        icon={CrownIcon}
        label="VIP"
        value={vip}
      />
      <DashboardStatCard
        href="/customers?filter=inactive"
        icon={UserMinusIcon}
        label="Inactive"
        value={inactive}
      />
    </DashboardStatGrid>
  );
}
