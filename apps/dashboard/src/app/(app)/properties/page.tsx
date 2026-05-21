import {
  createPrismaClient,
  listFilteredPropertiesForCompany,
} from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { buildTenantSiteUrl } from "@plotkeys/utils";
import { propertiesPageFilter } from "@plotkeys/api/filters";
import {
  DashboardPage,
  DashboardTablePage,
  DashboardTablePageBody,
} from "../../../components/dashboard/dashboard-page";
import { getBaseUrl } from "../../../lib/get-base-url";
import { loadPropertiesFilterParams } from "../../../lib/properties-filter-params";
import { requireOnboardedSession } from "../../../lib/session";
import { PropertiesHeader } from "./properties-header";
import { PropertiesDataTable } from "./tables/properties/data-table";
import { PropertiesEmptyState } from "./tables/properties/empty-states";

type PropertiesPageProps = {
  searchParams?: Promise<{ error?: string; q?: string; type?: string }>;
};

const statusVariant: Record<string, "default" | "outline" | "secondary"> = {
  active: "default",
  off_market: "outline",
  rented: "secondary",
  sold: "outline",
};

const publishVariant: Record<
  string,
  "default" | "outline" | "secondary" | "destructive"
> = {
  draft: "outline",
  published: "default",
  archived: "secondary",
};

const typeLabels: Record<string, string> = {
  residential: "Home",
  commercial: "Commercial",
  land: "Land",
  industrial: "Industrial",
  mixed_use: "Mixed use",
};

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadPropertiesFilterParams(params);
  const query = filters.q?.trim() ?? "";
  const typeFilter = filters.type ?? undefined;
  const currentOrigin = await getBaseUrl();

  const prisma = createPrismaClient().db;
  const properties = prisma
    ? await listFilteredPropertiesForCompany(
        prisma,
        session.activeMembership.companyId,
        filters,
      )
    : [];
  const filterList = await propertiesPageFilter();

  const siteUrl = buildTenantSiteUrl(session.activeMembership.companySlug, {
    currentOrigin,
  });

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      <DashboardTablePage>
        <PropertiesHeader
          count={properties.length}
          filterList={filterList}
          query={query}
          siteUrl={siteUrl}
          typeFilter={typeFilter}
          typeLabels={typeLabels}
        />

        <DashboardTablePageBody>
          {properties.length === 0 ? (
            <div className="p-5">
              <PropertiesEmptyState />
            </div>
          ) : (
            <PropertiesDataTable
              properties={properties}
              publishVariant={publishVariant}
              statusVariant={statusVariant}
              typeLabels={typeLabels}
            />
          )}
        </DashboardTablePageBody>
      </DashboardTablePage>
    </DashboardPage>
  );
}
