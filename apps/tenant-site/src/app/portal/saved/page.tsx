import {
  countSavedListingsForCustomer,
  createPrismaClient,
  listSavedListingsForCustomer,
} from "@plotkeys/db";
import Link from "next/link";

import { PortalSavedListingCard } from "../../../components/portal-saved-listing-card";
import { PortalCard, PortalPage } from "../../../components/portal-page";
import { getPortalCustomerSession } from "../../../lib/customer-session";

type PortalSavedPageProps = {
  searchParams?: Promise<{ savedStatus?: string }>;
};

export default async function PortalSavedPage({
  searchParams,
}: PortalSavedPageProps) {
  const [params, session] = await Promise.all([
    searchParams?.then((value) => value ?? {}) ??
      Promise.resolve<{ savedStatus?: string }>({}),
    getPortalCustomerSession(),
  ]);
  const prisma = createPrismaClient().db;
  const savedScope = session
    ? {
        companyId: session.company.id,
        customerId: session.customer.id,
      }
    : null;
  const [savedCount, savedListings] =
    prisma && savedScope
      ? await Promise.all([
          countSavedListingsForCustomer(prisma, savedScope),
          listSavedListingsForCustomer(prisma, savedScope),
        ])
      : [0, []];

  return (
    <PortalPage
      description="Review the properties you have saved from this tenant site and keep your shortlist in one central customer workspace."
      eyebrow="Customer workspace"
      title="Saved listings"
    >
      {params.savedStatus === "removed" ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
          Listing removed from your saved inventory.
        </div>
      ) : null}

      <PortalCard title="Saved inventory">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
          <p>
            <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
              Total saved listings:
            </span>{" "}
            {savedCount}
          </p>
          <Link
            className="font-medium text-[color:var(--pk-primary,#0f766e)] underline-offset-4 hover:underline"
            href="/"
          >
            Browse more listings
          </Link>
        </div>
      </PortalCard>

      {savedListings.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedListings.map((listing) => (
            <PortalSavedListingCard
              key={listing.id}
              listing={listing}
              redirectTo="/portal/saved"
            />
          ))}
        </div>
      ) : (
        <PortalCard title="No saved listings yet">
          <p className="text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            Save any property from its detail page and it will show up here for
            quick review later.
          </p>
        </PortalCard>
      )}
    </PortalPage>
  );
}
