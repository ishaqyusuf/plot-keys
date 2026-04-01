import {
  countSavedListingsForCustomer,
  createPrismaClient,
  listSavedListingsForCustomer,
} from "@plotkeys/db";
import Link from "next/link";

import { PortalSavedListingCard } from "../../../components/portal-saved-listing-card";
import { PortalCard, PortalPage } from "../../../components/portal-page";
import { getPortalCustomerSession } from "../../../lib/customer-session";

type PortalDashboardPageProps = {
  searchParams?: Promise<{ savedStatus?: string; signup?: string }>;
};

export default async function PortalDashboardPage({
  searchParams,
}: PortalDashboardPageProps) {
  const [rawParams, session] = await Promise.all([
    searchParams?.then((value) => value ?? {}) ??
      Promise.resolve<{ savedStatus?: string; signup?: string }>({}),
    getPortalCustomerSession(),
  ]);
  const params = rawParams ?? {};
  const prisma = createPrismaClient().db;
  const savedScope = session
    ? {
        companyId: session.company.id,
        customerId: session.customer.id,
      }
    : null;
  const [savedCount, recentSavedListings] =
    prisma && savedScope
      ? await Promise.all([
          countSavedListingsForCustomer(prisma, savedScope),
          listSavedListingsForCustomer(prisma, { ...savedScope, take: 3 }),
        ])
      : [0, []];

  return (
    <PortalPage
      description="Your customer workspace for saved inventory, offers, payments, and account access within this tenant portal."
      eyebrow="Portal home"
      title="Customer dashboard"
    >
      {params.signup ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          Your portal account is ready and you are now signed in.
        </div>
      ) : null}
      {params.savedStatus === "removed" ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
          Listing removed from your saved inventory.
        </div>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-3">
        <PortalCard title="Quick actions">
          <div className="space-y-3 text-sm">
            {[
              { href: "/portal/saved", label: "Review saved listings" },
              { href: "/portal/offers", label: "Track active offers" },
              { href: "/portal/payments", label: "Check payment status" },
            ].map((link) => (
              <Link
                key={link.href}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] px-4 py-3 text-[color:var(--pk-foreground,#0f172a)] transition hover:border-[color:var(--pk-primary,#0f766e)]/40 hover:text-[color:var(--pk-primary,#0f766e)]"
                href={link.href}
              >
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </PortalCard>

        <PortalCard title="Account snapshot">
          <div className="space-y-3 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
            <p>
              <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
                Name:
              </span>{" "}
              {session?.customer.name ?? "Customer"}
            </p>
            <p>
              <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
                Email:
              </span>{" "}
              {session?.user.email ?? "—"}
            </p>
            <p>
              <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
                Status:
              </span>{" "}
              {session?.customer.status ?? "active"}
            </p>
          </div>
        </PortalCard>

        <PortalCard title="Saved inventory">
          <div className="space-y-4 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
            <p>
              <span className="font-medium text-[color:var(--pk-foreground,#0f172a)]">
                Total saved listings:
              </span>{" "}
              {savedCount}
            </p>
            {recentSavedListings.length ? (
              <div className="space-y-3">
                {recentSavedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] px-4 py-3"
                  >
                    <Link
                      className="font-medium text-[color:var(--pk-foreground,#0f172a)] transition hover:text-[color:var(--pk-primary,#0f766e)]"
                      href={`/property/${listing.property.id}`}
                    >
                      {listing.property.title}
                    </Link>
                    <p className="mt-1 text-sm">
                      {listing.property.location}
                      {listing.property.price ? ` · ${listing.property.price}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                Start saving properties from public listing detail pages and
                they will appear here right away.
              </p>
            )}
          </div>
        </PortalCard>

        <PortalCard title="Coming online next">
          <ul className="space-y-3 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            <li>Offer status tracking and customer activity history</li>
            <li>Customer-scoped payments, receipts, and account settings</li>
            <li>Owned and reserved property visibility from one workspace</li>
          </ul>
        </PortalCard>

        {recentSavedListings.length ? (
          <div className="lg:col-span-3">
            <PortalCard title="Recently saved">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recentSavedListings.map((listing) => (
                  <PortalSavedListingCard
                    key={listing.id}
                    actionLabel="Remove"
                    listing={listing}
                    redirectTo="/portal/dashboard"
                  />
                ))}
              </div>
            </PortalCard>
          </div>
        ) : null}
      </div>
    </PortalPage>
  );
}
