import { createPrismaClient } from "@plotkeys/db";
import { buildPlatformAppUrl } from "@plotkeys/utils";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { DevTenantFab } from "../../components/dev/dev-tenant-fab";
import { PremiumLandingPage } from "../../components/marketing/premium-landing-page";
import { canPreviewPublicSiteModes } from "../../lib/public-site-mode";

export default async function LandingPreviewPage() {
  if (!canPreviewPublicSiteModes()) {
    notFound();
  }

  const headerStore = await headers();
  const prisma = createPrismaClient().db!;
  const tenants = await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      planTier: true,
      slug: true,
      tenantDomains: {
        orderBy: { createdAt: "asc" },
        select: { hostname: true, kind: true, status: true },
        where: {
          deletedAt: null,
          kind: { in: ["sitefront_custom_domain", "sitefront_subdomain"] },
        },
      },
    },
    where: { deletedAt: null, isActive: true },
  });
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const currentOrigin = host ? `${protocol}://${host}` : null;
  const createWorkspaceHref = buildPlatformAppUrl({
    currentOrigin,
    pathname: "/sign-up",
  });

  return (
    <>
      <DevTenantFab
        tenants={tenants.map((tenant) => ({
          hostname:
            tenant.tenantDomains.find(
              (domain) => domain.kind === "sitefront_custom_domain",
            )?.hostname ??
            tenant.tenantDomains.find(
              (domain) =>
                domain.kind === "sitefront_subdomain" &&
                domain.status === "active",
            )?.hostname ??
            tenant.tenantDomains.find(
              (domain) => domain.kind === "sitefront_subdomain",
            )?.hostname ??
            null,
          id: tenant.id,
          name: tenant.name,
          planTier: tenant.planTier,
          subdomain: tenant.slug,
        }))}
      />
      <PremiumLandingPage
        createWorkspaceHref={createWorkspaceHref}
        showEarlyAccessCta
      />
    </>
  );
}
