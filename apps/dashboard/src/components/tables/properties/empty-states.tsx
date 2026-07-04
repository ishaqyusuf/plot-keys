import { Button } from "@plotkeys/ui/button";
import { Building2 } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { PropertySheet } from "@/components/sheets/property-sheet";

export function PropertiesEmptyState() {
  return (
    <DashboardEmptyState
      title="No listings yet"
      description="Create your first home or land listing to start building the inventory."
      icon={<Building2 className="size-5" />}
      actions={
        <div className="flex items-center justify-center gap-2">
          <PropertySheet mode="create" />
          <Button asChild size="sm" variant="outline">
            <a href="/properties">Refresh</a>
          </Button>
        </div>
      }
    />
  );
}

export function PropertiesNoResults() {
  return (
    <DashboardEmptyState
      title="No matching listings"
      description="Try another search term or remove the active filters."
      icon={<Building2 className="size-5" />}
      actions={
        <Button asChild size="sm" type="button" variant="outline">
          <a href="/properties">Clear filters</a>
        </Button>
      }
    />
  );
}
