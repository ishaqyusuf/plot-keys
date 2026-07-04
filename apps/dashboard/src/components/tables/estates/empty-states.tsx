import { MapIcon } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { EstateCreateSheet } from "@/components/sheets/estate-create-sheet";

export function EstatesEmptyState() {
  return (
    <DashboardEmptyState
      actions={<EstateCreateSheet />}
      description="Create an estate launch when you want to group land listings around a presale deal and estate plan."
      icon={<MapIcon className="size-5" />}
      title="No estate launches yet"
    />
  );
}
