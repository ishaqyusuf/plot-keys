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
import { CustomersColumnVisibility } from "@/components/customers-column-visibility";
import { ExportCsvButton } from "@/components/export-csv-button";
import { OpenCustomerSheet } from "@/components/open-customer-sheet";
import { exportCustomersCsvAction } from "@/app/actions";
import { CustomersSearchFilter } from "./search-filter";

type CustomersHeaderProps = {
  canManage: boolean;
  count: number;
  query: string;
};

export function CustomersHeader({
  canManage,
  count,
  query,
}: CustomersHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <DashboardPageIntro className="space-y-1">
          <DashboardPageEyebrow>CRM</DashboardPageEyebrow>
          <DashboardPageTitle>Customers</DashboardPageTitle>
          <DashboardPageDescription>
            All customer records in one place. Filter, scan, and update
            relationship status from a single table.
          </DashboardPageDescription>
        </DashboardPageIntro>

        <DashboardPageActions>
          <CustomersColumnVisibility />
          <ExportCsvButton
            exportAction={exportCustomersCsvAction}
            filename="customers.csv"
          />
          {canManage ? <OpenCustomerSheet /> : null}
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <div className="space-y-1">
          <DashboardTablePageTitle>All customers</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            {count} customer{count !== 1 ? "s" : ""}
            {query ? ` matching "${query}".` : "."}
          </DashboardTablePageDescription>
        </div>

        <CustomersSearchFilter />
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
