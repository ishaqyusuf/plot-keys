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
} from "@/components/dashboard/dashboard-page";
import { ExportCsvButton } from "@/components/export-csv-button";
import { PropertiesColumnVisibility } from "@/components/properties-column-visibility";
import { PropertySheet } from "@/components/sheets/property-sheet";
import { exportPropertiesCsvAction } from "@/app/actions";
import { PropertiesSearchFilter } from "./search-filter";

type PropertiesHeaderProps = {
  count: number;
  query: string;
  siteUrl: string;
};

export function PropertiesHeader({
  count,
  query,
  siteUrl,
}: PropertiesHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <DashboardPageIntro className="space-y-1">
          <DashboardPageEyebrow>Listings</DashboardPageEyebrow>
          <DashboardPageTitle>Listings</DashboardPageTitle>
          <DashboardPageDescription>
            Homes and land listings in one place. Filter, scan, and update
            inventory from a single table.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <PropertiesColumnVisibility />
          <PropertySheet mode="create" />
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
          <DashboardTablePageTitle>All listings</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            {count} listing{count !== 1 ? "s" : ""}
            {query ? ` matching "${query}".` : "."}
          </DashboardTablePageDescription>
        </div>

        <PropertiesSearchFilter />
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
