import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import {
  DashboardPage,
  DashboardTablePage,
  DashboardTablePageBody,
} from "../../../components/dashboard/dashboard-page";
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
  residential: "Residential",
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
  const query = params.q?.trim() ?? "";
  const typeFilter =
    params.type && params.type !== "all" ? params.type : undefined;

  const prisma = createPrismaClient().db;
  const properties = prisma
    ? await prisma.property.findMany({
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        where: {
          companyId: session.activeMembership.companyId,
          deletedAt: null,
          ...(typeFilter
            ? {
                type: typeFilter as
                  | "residential"
                  | "commercial"
                  | "land"
                  | "industrial"
                  | "mixed_use",
              }
            : {}),
          ...(query
            ? {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { location: { contains: query, mode: "insensitive" } },
                  { price: { contains: query, mode: "insensitive" } },
                ],
              }
            : {}),
        },
      })
    : [];

  const siteUrl = `https://${session.activeMembership.companySlug}.plotkeys.com`;

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
