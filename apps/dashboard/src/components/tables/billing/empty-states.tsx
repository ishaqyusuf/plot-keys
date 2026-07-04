import { CreditCard } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function BillingHistoryEmptyState() {
  return (
    <DashboardEmptyState
      description="No billing records yet."
      icon={<CreditCard className="size-5" />}
      title="No billing history"
    />
  );
}
