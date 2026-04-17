import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardTableToolbar,
  DashboardTableToolbarGroup,
} from "../../../components/dashboard/dashboard-page";

type PropertiesSearchFilterProps = {
  query: string;
  typeFilter?: string;
  typeLabels: Record<string, string>;
};

export function PropertiesSearchFilter({
  query,
  typeFilter,
  typeLabels,
}: PropertiesSearchFilterProps) {
  function buildFilterHref(type: string) {
    const next = new URLSearchParams();

    if (query) {
      next.set("q", query);
    }

    if (type !== "all") {
      next.set("type", type);
    }

    const qs = next.toString();
    return qs ? `/properties?${qs}` : "/properties";
  }

  return (
    <DashboardTableToolbar className="w-full">
      <form action="/properties" className="w-full max-w-sm">
        <div className="flex items-center gap-2">
          <Input
            defaultValue={query}
            name="q"
            placeholder="Search properties..."
          />
          {typeFilter ? (
            <input name="type" type="hidden" value={typeFilter} />
          ) : null}
          <Button size="sm" type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>
      <DashboardTableToolbarGroup>
        <DashboardFilterTabs className="bg-background/70">
          {[
            "all",
            "residential",
            "commercial",
            "land",
            "industrial",
            "mixed_use",
          ].map((type) => {
            const isActive =
              (type === "all" && !typeFilter) || type === typeFilter;

            return (
              <DashboardFilterTab
                key={type}
                active={isActive}
                href={buildFilterHref(type)}
              >
                {type === "all" ? "All" : typeLabels[type]}
              </DashboardFilterTab>
            );
          })}
        </DashboardFilterTabs>
      </DashboardTableToolbarGroup>
    </DashboardTableToolbar>
  );
}
