import { Button } from "@plotkeys/ui/button";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardTableFilters,
  DashboardTableHeaderTop,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
} from "../../../components/dashboard/dashboard-page";
import { ExportCsvButton } from "../../../components/export-csv-button";
import { exportPropertiesCsvAction } from "../../actions";
import { PropertiesSearchFilter } from "./properties-search-filter";
import { PropertyForm } from "./property-form";

type PropertiesHeaderProps = {
  count: number;
  query: string;
  siteUrl: string;
  typeFilter?: string;
  typeLabels: Record<string, string>;
};

export function PropertiesHeader({
  count,
  query,
  siteUrl,
  typeFilter,
  typeLabels,
}: PropertiesHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <DashboardPageIntro className="space-y-1">
          <DashboardPageEyebrow>Properties</DashboardPageEyebrow>
          <DashboardPageTitle>Properties</DashboardPageTitle>
          <DashboardPageDescription>
            All listings in one place. Filter, scan, and update inventory from a
            single table.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <PropertyForm mode="create" />
          <ExportCsvButton
            exportAction={exportPropertiesCsvAction}
            filename="properties.csv"
          />
          <Button asChild size="sm" variant="outline">
            <a href={siteUrl} rel="noopener noreferrer" target="_blank">
              View site
            </a>
          </Button>
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <div className="space-y-1">
          <DashboardTablePageTitle>All properties</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            {count} listing{count !== 1 ? "s" : ""}
            {query ? ` matching “${query}”.` : "."}
          </DashboardTablePageDescription>
        </div>

        <PropertiesSearchFilter
          query={query}
          typeFilter={typeFilter}
          typeLabels={typeLabels}
        />
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
