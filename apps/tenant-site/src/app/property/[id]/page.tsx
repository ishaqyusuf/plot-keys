import {
  createPrismaClient,
  isListingSavedForCustomer,
  resolveTenantByHostname,
} from "@plotkeys/db";
import { extractTenantHostname } from "@plotkeys/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { toggleSavedListingAction } from "../../portal/actions";
import { getPortalCustomerSession } from "../../../lib/customer-session";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    hostname?: string;
    savedStatus?: string;
    subdomain?: string;
  }>;
};

export default async function PropertyDetailPage({
  params,
  searchParams,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    notFound();
  }

  const tenantSubdomain =
    requestHeaders.get("x-tenant-subdomain") || sp.subdomain || null;
  const tenantHostname =
    requestHeaders.get("x-tenant-hostname") ||
    extractTenantHostname(sp.hostname) ||
    null;

  // Resolve company from hostname or subdomain.
  const resolvedTenant = tenantHostname
    ? await resolveTenantByHostname(prisma, tenantHostname)
    : null;

  const company = resolvedTenant
    ? await prisma.company.findFirst({
        where: { deletedAt: null, id: resolvedTenant.companyId },
      })
    : tenantSubdomain
      ? await prisma.company.findFirst({
          where: { deletedAt: null, slug: tenantSubdomain },
        })
      : null;

  if (!company) {
    notFound();
  }

  const property = await prisma.property.findFirst({
    where: { companyId: company.id, deletedAt: null, id },
  });

  if (!property) {
    notFound();
  }

  const session = await getPortalCustomerSession();
  const isSignedInCustomer =
    session?.company.id === company.id && Boolean(session.customer.id);
  const isSaved = isSignedInCustomer
    ? await isListingSavedForCustomer(prisma, {
        companyId: company.id,
        customerId: session.customer.id,
        propertyId: property.id,
      })
    : false;
  const savedStatus = sp.savedStatus;

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          href="/"
        >
          ← Back to listings
        </Link>

        {property.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={property.title}
            className="mt-6 h-72 w-full rounded-2xl object-cover md:h-96"
            src={property.imageUrl}
          />
        ) : (
          <div className="mt-6 h-72 w-full rounded-2xl bg-gradient-to-br from-blue-100 via-amber-100 to-teal-100 md:h-96" />
        )}

        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
            {property.location}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground md:text-5xl">
            {property.title}
          </h1>

          {property.price && (
            <p className="mt-4 text-2xl font-semibold text-foreground">
              {property.price}
            </p>
          )}

          {property.specs && (
            <p className="mt-3 text-base text-muted-foreground">{property.specs}</p>
          )}

          {(property.bedrooms != null || property.bathrooms != null) && (
            <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
              {property.bedrooms != null && (
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? "s" : ""}</span>
              )}
              {property.bathrooms != null && (
                <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? "s" : ""}</span>
              )}
            </div>
          )}

          {property.description && (
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              {property.description}
            </p>
          )}

          {savedStatus === "saved" ? (
            <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              This property is now saved in your portal.
            </p>
          ) : null}
          {savedStatus === "already-saved" ? (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              This property is already in your saved listings.
            </p>
          ) : null}
          {savedStatus === "removed" ? (
            <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              This property was removed from your saved listings.
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isSignedInCustomer ? (
              <form action={toggleSavedListingAction}>
                <input
                  name="mode"
                  type="hidden"
                  value={isSaved ? "remove" : "save"}
                />
                <input name="propertyId" type="hidden" value={property.id} />
                <input
                  name="redirectTo"
                  type="hidden"
                  value={`/property/${property.id}`}
                />
                <button
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--pk-border,#e2e8f0)] px-6 py-3 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] transition hover:border-[color:var(--pk-primary,#0f766e)]/40 hover:text-[color:var(--pk-primary,#0f766e)]"
                  type="submit"
                >
                  {isSaved ? "Remove from saved" : "Save to portal"}
                </button>
              </form>
            ) : (
              <Link
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--pk-border,#e2e8f0)] px-6 py-3 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] transition hover:border-[color:var(--pk-primary,#0f766e)]/40 hover:text-[color:var(--pk-primary,#0f766e)]"
                href={`/portal/login?redirect=${encodeURIComponent(`/property/${property.id}`)}`}
              >
                Sign in to save
              </Link>
            )}

            <div className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
              Enquire about this property
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
