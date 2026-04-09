import {
  countOffersForCustomer,
  createPrismaClient,
  listOffersForCustomer,
} from "@plotkeys/db";
import Link from "next/link";

import { PortalOfferCard } from "../../../components/portal-offer-card";
import { PortalCard, PortalPage } from "../../../components/portal-page";
import { getPortalCustomerSession } from "../../../lib/customer-session";

type PortalOffersPageProps = {
  searchParams?: Promise<{ offerStatus?: string }>;
};

export default async function PortalOffersPage({
  searchParams,
}: PortalOffersPageProps) {
  const [params, session] = await Promise.all([
    searchParams?.then((value) => value ?? {}) ??
      Promise.resolve<{ offerStatus?: string }>({}),
    getPortalCustomerSession(),
  ]);
  const prisma = createPrismaClient().db;
  const scope = session
    ? {
        companyId: session.company.id,
        customerId: session.customer.id,
      }
    : null;
  const [offerCount, offers] =
    prisma && scope
      ? await Promise.all([
          countOffersForCustomer(prisma, scope),
          listOffersForCustomer(prisma, scope),
        ])
      : [0, []];

  return (
    <PortalPage
      description="Track your submitted offers and their current status across all properties."
      eyebrow="Customer workspace"
      title="My Offers"
    >
      {params.offerStatus === "submitted" ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          Your offer has been submitted. You can track it below.
        </div>
      ) : null}
      {params.offerStatus === "already-pending" ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
          You already have a pending offer on this property.{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="/portal/offers"
          >
            View it here.
          </Link>
        </div>
      ) : null}
      {params.offerStatus === "withdrawn" ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
          Your offer has been withdrawn.
        </div>
      ) : null}
      {params.offerStatus === "withdraw-failed" ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Unable to withdraw — this offer may have already been actioned.
        </div>
      ) : null}

      <PortalCard title="Offer summary">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
          <p>
            <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
              Total offers:
            </span>{" "}
            {offerCount}
          </p>
          <Link
            className="font-medium text-[color:var(--pk-primary,#0f766e)] underline-offset-4 hover:underline"
            href="/"
          >
            Browse listings
          </Link>
        </div>
      </PortalCard>

      {offers.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer) => (
            <PortalOfferCard
              key={offer.id}
              offer={offer}
              redirectTo="/portal/offers"
            />
          ))}
        </div>
      ) : (
        <PortalCard title="No offers yet">
          <p className="text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            Submit an offer from any property detail page and it will appear
            here for tracking.
          </p>
        </PortalCard>
      )}
    </PortalPage>
  );
}
