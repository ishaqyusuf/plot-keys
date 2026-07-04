import { Globe } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function DomainsEmptyState() {
  return (
    <DashboardEmptyState
      description="No domains have been provisioned yet. Complete onboarding or trigger a sync to create them."
      icon={<Globe className="size-5" />}
      title="No domains provisioned"
    />
  );
}
