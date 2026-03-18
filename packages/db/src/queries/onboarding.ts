import { randomUUID } from "node:crypto";

import type { Db } from "../prisma";

export type OnboardingStepProgressInput = {
  userId: string;
  currentStep?: string;
  companyName?: string;
  // Step 1: Business Identity
  tagline?: string | null;
  businessType?: string | null;
  primaryGoal?: string | null;
  // Step 2: Market Focus
  locations?: string[];
  propertyTypes?: string[];
  targetAudience?: string | null;
  // Step 3: Brand Style
  tone?: string | null;
  stylePreference?: string | null;
  preferredColorHint?: string | null;
  // Step 4: Contact And Operations
  phone?: string | null;
  contactEmail?: string | null;
  whatsapp?: string | null;
  officeAddress?: string | null;
  // Step 5: Content Readiness
  hasLogo?: boolean;
  hasListings?: boolean;
  hasExistingContent?: boolean;
  hasAgents?: boolean;
  hasProjects?: boolean;
  hasTestimonials?: boolean;
  hasBlogContent?: boolean;
  // Final step
  market?: string | null;
  subdomain?: string;
  templateKey?: string | null;
};

export async function upsertTenantOnboarding(
  db: Db,
  input: {
    companyName: string;
    currentStep?: string;
    market?: string;
    subdomain: string;
    templateKey?: string;
    userId: string;
  },
) {
  return db.tenantOnboarding.upsert({
    create: {
      companyName: input.companyName.trim(),
      currentStep: input.currentStep ?? "business-identity",
      id: randomUUID(),
      market: input.market?.trim() || null,
      subdomain: input.subdomain.trim().toLowerCase(),
      templateKey: input.templateKey ?? null,
      userId: input.userId,
    },
    update: {
      companyName: input.companyName.trim(),
      currentStep: input.currentStep ?? "business-identity",
      ...(input.market !== undefined && { market: input.market.trim() || null }),
      subdomain: input.subdomain.trim().toLowerCase(),
      ...(input.templateKey !== undefined && { templateKey: input.templateKey }),
    },
    where: { userId: input.userId },
  });
}

export async function saveOnboardingStepProgress(
  db: Db,
  input: OnboardingStepProgressInput,
) {
  const { userId, ...fields } = input;

  return db.tenantOnboarding.update({
    data: {
      ...(fields.currentStep !== undefined && { currentStep: fields.currentStep }),
      ...(fields.companyName !== undefined && { companyName: fields.companyName.trim() }),
      // Step 1
      ...(fields.tagline !== undefined && { tagline: fields.tagline }),
      ...(fields.businessType !== undefined && { businessType: fields.businessType }),
      ...(fields.primaryGoal !== undefined && { primaryGoal: fields.primaryGoal }),
      // Step 2
      ...(fields.locations !== undefined && { locations: fields.locations }),
      ...(fields.propertyTypes !== undefined && { propertyTypes: fields.propertyTypes }),
      ...(fields.targetAudience !== undefined && { targetAudience: fields.targetAudience }),
      // Step 3
      ...(fields.tone !== undefined && { tone: fields.tone }),
      ...(fields.stylePreference !== undefined && { stylePreference: fields.stylePreference }),
      ...(fields.preferredColorHint !== undefined && { preferredColorHint: fields.preferredColorHint }),
      // Step 4
      ...(fields.phone !== undefined && { phone: fields.phone }),
      ...(fields.contactEmail !== undefined && { contactEmail: fields.contactEmail }),
      ...(fields.whatsapp !== undefined && { whatsapp: fields.whatsapp }),
      ...(fields.officeAddress !== undefined && { officeAddress: fields.officeAddress }),
      // Step 5
      ...(fields.hasLogo !== undefined && { hasLogo: fields.hasLogo }),
      ...(fields.hasListings !== undefined && { hasListings: fields.hasListings }),
      ...(fields.hasExistingContent !== undefined && { hasExistingContent: fields.hasExistingContent }),
      ...(fields.hasAgents !== undefined && { hasAgents: fields.hasAgents }),
      ...(fields.hasProjects !== undefined && { hasProjects: fields.hasProjects }),
      ...(fields.hasTestimonials !== undefined && { hasTestimonials: fields.hasTestimonials }),
      ...(fields.hasBlogContent !== undefined && { hasBlogContent: fields.hasBlogContent }),
      // Final
      ...(fields.market !== undefined && { market: fields.market }),
      ...(fields.subdomain !== undefined && { subdomain: fields.subdomain }),
      ...(fields.templateKey !== undefined && { templateKey: fields.templateKey }),
    },
    where: { userId },
  });
}

export async function findTenantOnboardingByUserId(db: Db, userId: string) {
  return db.tenantOnboarding.findUnique({
    where: { userId },
  });
}

export async function completeTenantOnboarding(db: Db, userId: string) {
  return db.tenantOnboarding.updateMany({
    data: {
      completedAt: new Date(),
      currentStep: "done",
    },
    where: {
      completedAt: null,
      userId,
    },
  });
}

export async function createCompanyOnboardingBundle(
  db: Db,
  input: {
    apexDomain: string;
    companyName: string;
    createdById: string;
    dashboardHostname: string;
    initialSiteConfiguration: {
      contentJson: Record<string, string>;
      name: string;
      subdomain: string;
      templateKey: string;
      themeJson: Record<string, string>;
    };
    market: string;
    sitefrontHostname: string;
    subdomain: string;
  },
) {
  return db.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        market: input.market,
        name: input.companyName,
        planStartedAt: new Date(),
        planStatus: "active",
        planTier: "starter",
        slug: input.subdomain,
      },
    });

    await tx.membership.create({
      data: {
        companyId: company.id,
        role: "owner",
        status: "active",
        userId: input.createdById,
      },
    });

    await tx.tenantDomain.createMany({
      data: [
        {
          apexDomain: input.apexDomain,
          companyId: company.id,
          hostname: input.sitefrontHostname,
          kind: "sitefront_subdomain",
          status: "pending",
          subdomainLabel: input.subdomain,
          vercelProjectKey: "sitefront",
        },
        {
          apexDomain: input.apexDomain,
          companyId: company.id,
          hostname: input.dashboardHostname,
          kind: "dashboard_subdomain",
          status: "pending",
          subdomainLabel: `dashboard.${input.subdomain}`,
          vercelProjectKey: "dashboard",
        },
      ],
    });

    return tx.siteConfiguration.create({
      data: {
        ...input.initialSiteConfiguration,
        companyId: company.id,
        createdById: input.createdById,
        publishedAt: new Date(),
        status: "published",
        updatedById: input.createdById,
      },
    });
  });
}
