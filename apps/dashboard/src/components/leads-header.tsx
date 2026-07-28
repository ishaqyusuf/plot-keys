import { LeadsColumnVisibility } from "@/components/leads-column-visibility";
import { LeadsSearchFilter } from "@/components/leads-search-filter";
import { LeadsStatusTabs } from "@/components/leads-status-tabs";

export function LeadsHeader() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <LeadsSearchFilter />

        <div className="flex items-center gap-2">
          <LeadsColumnVisibility />
        </div>
      </div>

      <LeadsStatusTabs />
    </div>
  );
}
