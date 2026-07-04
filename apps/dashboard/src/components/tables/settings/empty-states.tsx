import { Settings2 } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function SettingsUnavailableState() {
  return (
    <DashboardEmptyState
      description="Workspace settings could not be loaded."
      icon={<Settings2 className="size-5" />}
      title="Settings unavailable"
    />
  );
}
