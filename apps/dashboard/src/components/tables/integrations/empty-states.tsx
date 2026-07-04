import { Settings } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function IntegrationsEmptyState() {
  return (
    <DashboardEmptyState
      description="Integration options will appear here when services are available for this workspace."
      icon={<Settings className="size-5" />}
      title="No integrations available"
    />
  );
}
