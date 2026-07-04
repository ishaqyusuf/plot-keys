import {
  createPrismaClient,
  getCustomerPlotSelectionDetails,
} from "@plotkeys/db";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortalCard, PortalPage } from "../../../../../components/portal-page";
import { getPortalCustomerSession } from "../../../../../lib/customer-session";
import { PlotSelectionClient } from "./plot-selection-client";

type SelectPlotPageProps = {
  params: Promise<{ offerId: string }>;
  searchParams?: Promise<{ error?: string; selected?: string }>;
};

export default async function SelectPlotPage({
  params,
  searchParams,
}: SelectPlotPageProps) {
  const [{ offerId }, query, session] = await Promise.all([
    params,
    searchParams?.then((value) => value ?? {}) ??
      Promise.resolve<{ error?: string; selected?: string }>({}),
    getPortalCustomerSession(),
  ]);
  const prisma = createPrismaClient().db;

  if (!session || !prisma) notFound();

  const details = await getCustomerPlotSelectionDetails(prisma, {
    companyId: session.company.id,
    customerId: session.customer.id,
    offerId,
  });

  if (!details) notFound();

  const imageUrl =
    details.layout.normalizedImageUrl ?? details.layout.sourceUrl;
  const imageWidth = details.layout.imageWidth ?? 1688;
  const imageHeight = details.layout.imageHeight ?? 2347;

  return (
    <PortalPage
      description="Choose the exact plot you prefer for your accepted estate offer."
      eyebrow="Accepted offer"
      title="Select your preferred plot"
    >
      {query.error ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {query.error}
        </div>
      ) : null}
      {query.selected ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          Your preferred plot has been reserved.
        </div>
      ) : null}

      <PortalCard title={details.offer.property.title}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
          <p>
            {details.estate.title}
            {details.estate.location ? ` · ${details.estate.location}` : ""}
          </p>
          <Link
            className="font-medium text-[color:var(--pk-primary,#0f766e)] underline-offset-4 hover:underline"
            href="/portal/offers"
          >
            Back to offers
          </Link>
        </div>
      </PortalCard>

      <PlotSelectionClient
        offerId={offerId}
        imageHeight={imageHeight}
        imageUrl={imageUrl}
        imageWidth={imageWidth}
        initialSelectedPlotId={details.offer.selectedPlot?.id}
        plots={details.plots}
      />
    </PortalPage>
  );
}
