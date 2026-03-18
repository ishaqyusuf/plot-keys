import { createPrismaClient, resolveTenantByHostname } from "@plotkeys/db";
import { extractTenantHostname } from "@plotkeys/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ hostname?: string; subdomain?: string }>;
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

          <div className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Enquire about this property
          </div>
        </div>
      </div>
    </main>
  );
}
