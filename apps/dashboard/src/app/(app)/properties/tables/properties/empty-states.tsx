import { Button } from "@plotkeys/ui/button";
import { Building2 } from "lucide-react";
import { DashboardEmptyState } from "../../../../../components/dashboard/dashboard-empty-state";
import { PropertyForm } from "../../property-form";

export function PropertiesEmptyState() {
  return (
    <DashboardEmptyState
      title="No properties yet"
      description="Create your first listing to start building the inventory."
      icon={<Building2 className="size-5" />}
      actions={
        <div className="flex items-center justify-center gap-2">
          <PropertyForm mode="create" />
          <Button asChild size="sm" variant="outline">
            <a href="/properties">Refresh</a>
          </Button>
        </div>
      }
    />
  );
}
