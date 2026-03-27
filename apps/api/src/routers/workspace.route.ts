import {
  completeTenantOnboarding,
  countAppointmentsByStatus,
  countCompaniesByTemplateKey,
  countLeadsByStatus,
  createAgent,
  createAppointment,
  createCompanyOnboardingBundle,
  createPrismaClient,
  createProperty,
  createSiteConfiguration,
  type Db,
  deductAiCredits,
  deleteAgent,
  deleteAppointment,
  deleteProperty,
  findCompanyById,
  findCompanyBySlug,
  findLatestDraftForTemplate,
  findLatestSiteConfigurationForCompany,
  findLicensedTemplateKeys,
  findSiteConfigurationByIdForCompany,
  findTemplateLicensesForCompany,
  findTenantOnboardingByUserId,
  getAiCreditBalance,
  getAiUsageStats,
  getAnalyticsSummary,
  getPageViewsByDay,
  grantAiCredits,
  grantStockImageLicense,
  grantTemplateLicense,
  hasEnoughCredits,
  hasStockImageLicense,
  hasTemplateLicense,
  listAgentsForCompany,
  listAppointmentsForCompany,
  listFeaturedProperties,
  listLeadsForCompany,
  listPropertiesForCompany,
  listStockImageLicensesForCompany,
  listSyncableTenantDomains,
  listTenantDomainsForCompany,
  logAiUsage,
  publishSiteConfiguration,
  resolveActiveDraftForCompany,
  saveOnboardingStepProgress,
  syncPlanIncludedLicenses,
  toggleAgentFeatured,
  togglePropertyFeatured,
  updateAgent,
  updateAppointmentStatus,
  updateCompanyLogo,
  updateCompanyPlan,
  updateCompanyProfile,
  updateDraftVersion,
  updateLeadStatus,
  updateOnboardingProfile,
  updateProperty,
  updateSiteConfigurationContentField,
  updateSiteConfigurationThemeField,
} from "@plotkeys/db";
import { domainSyncHandler, triggerJob } from "@plotkeys/jobs";
import { domainSyncTask } from "@plotkeys/jobs/tasks";
import {
  buildBusinessSummary,
  createInitialSiteConfigurationInput,
  deriveDesignConfig,
  derivePersonalizedContent,
  deriveProfile,
  getTemplateDefinition,
  scoreTemplates,
  templateCatalog,
} from "@plotkeys/section-registry";
import {
  buildDashboardHostname,
  buildSitefrontHostname,
  describeTemplateAccess,
  isVercelDomainProvisioningConfigured,
  plotkeysRootDomain,
  type SubscriptionTier,
} from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateFieldContent, generateOnboardingContent } from "../lib.ai";
import {
  assertMinRole,
  authenticatedProcedure,
  createTRPCRouter,
  membershipProcedure,
  publicProcedure,
} from "../lib.trpc";
import {
  changePlanInputSchema,
  completeOnboardingInputSchema,
  createAppointmentInputSchema,
  createTemplateDraftInputSchema,
  initializeCheckoutInputSchema,
  publishSiteConfigurationInputSchema,
  saveOnboardingProgressInputSchema,
  smartFillFieldInputSchema,
  updateAppointmentStatusInputSchema,
  updateLeadStatusInputSchema,
  updateSiteFieldInputSchema,
} from "../schemas/workspace.schema";

const reservedSubdomains = new Set([
  "admin",
  "api",
  "app",
  "dashboard",
  "mail",
  "support",
  "www",
]);

function requireDb(db: Db | null) {
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "DATABASE_URL is not configured.",
    });
  }

  return db;
}

function getDb(): Db {
  return requireDb(createPrismaClient().db);
}

function assertTemplateAccess(planTier: SubscriptionTier, templateKey: string) {
  const template = getTemplateDefinition(templateKey);
  const templateAccess = describeTemplateAccess(planTier, template.tier);

  if (!templateAccess.allowed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: templateAccess.message,
    });
  }
}

async function getTemplateAccessWithLicense(
  db: Db,
  companyId: string,
  planTier: SubscriptionTier,
  templateKey: string,
) {
  const template = getTemplateDefinition(templateKey);
  const templateAccess = describeTemplateAccess(planTier, template.tier);
  const licensed = await hasTemplateLicense(db, companyId, templateKey);

  return {
    ...templateAccess,
    allowed: licensed || templateAccess.allowed,
    licensed,
    templateTier: template.tier,
  };
}

/**
 * License-aware access check: allows access if the company holds a valid
 * license record for the template, regardless of plan tier.
 * Falls back to plan-tier check when no license table entry exists.
 */
async function assertTemplateAccessWithLicense(
  db: Db,
  companyId: string,
  planTier: SubscriptionTier,
  templateKey: string,
) {
  const templateAccess = await getTemplateAccessWithLicense(
    db,
    companyId,
    planTier,
    templateKey,
  );

  if (templateAccess.allowed) return;

  throw new TRPCError({
    code: "FORBIDDEN",
    message: `${templateAccess.message} Upgrade your plan before editing or publishing this template.`,
  });
}

async function assertCompanyCanUseTemplate(
  db: Db,
  companyId: string,
  templateKey: string,
) {
  const company = await findCompanyById(db, companyId);

  if (!company) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Company not found.",
    });
  }

  await assertTemplateAccessWithLicense(
    db,
    company.id,
    company.planTier,
    templateKey,
  );

  return company;
}

async function assertSubdomainAvailability(db: Db, subdomain: string) {
  if (!subdomain || subdomain.length < 3) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Choose a subdomain with at least 3 characters.",
    });
  }

  if (reservedSubdomains.has(subdomain)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "That subdomain is reserved. Choose another one.",
    });
  }

  const existingCompany = await findCompanyBySlug(db, subdomain);

  if (existingCompany) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "That subdomain is already in use.",
    });
  }
}

export const workspaceRouter = createTRPCRouter({
  completeOnboarding: authenticatedProcedure
    .input(completeOnboardingInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      if (ctx.auth.activeMembership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Onboarding has already been completed for this user.",
        });
      }

      // Use the persisted onboarding record as the source of truth so that
      // company identity is consistent regardless of which device or session
      // the user finishes from. Fall back to input values for backward compat.
      const savedOnboarding = await findTenantOnboardingByUserId(
        db,
        ctx.auth.session.user.id,
      );

      const companyName = savedOnboarding?.companyName ?? input.companyName;
      const subdomain = savedOnboarding?.subdomain ?? input.subdomain;
      const market = input.market;
      const templateKey = input.templateKey;

      await assertSubdomainAvailability(db, subdomain);
      assertTemplateAccess("starter", templateKey);

      // Derive personalized content and design from the onboarding profile
      const snapshot = savedOnboarding
        ? {
            businessType: savedOnboarding.businessType,
            companyName: savedOnboarding.companyName,
            hasBlogContent: savedOnboarding.hasBlogContent,
            hasAgents: savedOnboarding.hasAgents,
            hasExistingContent: savedOnboarding.hasExistingContent,
            hasListings: savedOnboarding.hasListings,
            hasLogo: savedOnboarding.hasLogo,
            hasProjects: savedOnboarding.hasProjects,
            hasTestimonials: savedOnboarding.hasTestimonials,
            locations: savedOnboarding.locations,
            primaryGoal: savedOnboarding.primaryGoal,
            propertyTypes: savedOnboarding.propertyTypes,
            stylePreference: savedOnboarding.stylePreference,
            tagline: savedOnboarding.tagline,
            targetAudience: savedOnboarding.targetAudience,
            tone: savedOnboarding.tone,
          }
        : null;

      const profile = snapshot ? deriveProfile(snapshot) : null;
      const designConfig =
        profile && snapshot ? deriveDesignConfig(profile, snapshot) : null;
      const personalizedContent =
        profile && snapshot
          ? derivePersonalizedContent(
              {
                ...snapshot,
                locations: [market, ...(snapshot.locations ?? [])],
              },
              profile,
            )
          : null;

      const template = getTemplateDefinition(templateKey);

      const initialSiteConfiguration =
        personalizedContent && designConfig
          ? {
              contentJson: personalizedContent,
              name: `${template.name} Draft`,
              subdomain,
              templateKey: template.key,
              themeJson: {
                ...template.defaultTheme,
                accentColor: designConfig.accentColor,
                backgroundColor: designConfig.backgroundColor,
                fontFamily: designConfig.fontFamily,
                headingFontFamily: designConfig.headingFontFamily,
                logo: companyName,
                market,
              },
            }
          : createInitialSiteConfigurationInput({
              companyName,
              market,
              subdomain,
              templateKey,
            });

      const siteConfiguration = await createCompanyOnboardingBundle(db, {
        apexDomain: plotkeysRootDomain,
        companyName,
        createdById: ctx.auth.session.user.id,
        dashboardHostname: buildDashboardHostname(subdomain),
        initialSiteConfiguration,
        market,
        sitefrontHostname: buildSitefrontHostname(subdomain),
        subdomain,
      });

      // Mark the onboarding record as completed
      await completeTenantOnboarding(db, ctx.auth.session.user.id);

      // Grant the free template license for the chosen template
      await grantTemplateLicense(db, {
        companyId: siteConfiguration.companyId,
        grantedById: ctx.auth.session.user.id,
        source: "free",
        templateKey,
      });

      // Auto-trigger Vercel domain provisioning in the background
      if (isVercelDomainProvisioningConfigured()) {
        triggerJob(
          domainSyncTask,
          domainSyncHandler,
          { companyId: siteConfiguration.companyId },
          { baseDelayMs: 2000, maxAttempts: 4 },
        ).catch(() => {
          // Domain sync failures are non-blocking; tenants can retry later
        });
      }

      return {
        configId: siteConfiguration.id,
      };
    }),
  getOnboardingState: authenticatedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const onboarding = await findTenantOnboardingByUserId(
      db,
      ctx.auth.session.user.id,
    );

    if (!onboarding) {
      return null;
    }

    return {
      // Core
      companyName: onboarding.companyName,
      completedAt: onboarding.completedAt,
      currentStep: onboarding.currentStep,
      subdomain: onboarding.subdomain,
      // Step 1
      tagline: onboarding.tagline,
      businessType: onboarding.businessType,
      primaryGoal: onboarding.primaryGoal,
      // Step 2
      locations: onboarding.locations,
      propertyTypes: onboarding.propertyTypes,
      targetAudience: onboarding.targetAudience,
      // Step 3
      tone: onboarding.tone,
      stylePreference: onboarding.stylePreference,
      preferredColorHint: onboarding.preferredColorHint,
      // Step 4
      phone: onboarding.phone,
      contactEmail: onboarding.contactEmail,
      whatsapp: onboarding.whatsapp,
      officeAddress: onboarding.officeAddress,
      // Step 5
      hasLogo: onboarding.hasLogo,
      hasListings: onboarding.hasListings,
      hasExistingContent: onboarding.hasExistingContent,
      hasAgents: onboarding.hasAgents,
      hasProjects: onboarding.hasProjects,
      hasTestimonials: onboarding.hasTestimonials,
      hasBlogContent: onboarding.hasBlogContent,
      // Derived profile
      businessSummary: onboarding.businessSummary,
      segment: onboarding.segment,
      designIntent: onboarding.designIntent,
      conversionFocus: onboarding.conversionFocus,
      complexity: onboarding.complexity,
      recommendedTemplateKey: onboarding.recommendedTemplateKey,
      // Final
      market: onboarding.market,
      templateKey: onboarding.templateKey,
    };
  }),
  saveOnboardingProgress: authenticatedProcedure
    .input(saveOnboardingProgressInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.auth.session.user.id;

      const existing = await findTenantOnboardingByUserId(db, userId);

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No onboarding record found. Complete sign-up before saving progress.",
        });
      }

      const updated = await saveOnboardingStepProgress(db, {
        userId,
        ...input,
      });

      // Re-derive profile after every save so the Launch step always has
      // an up-to-date recommendation without an extra round-trip.
      const snapshot = {
        businessType: updated.businessType,
        companyName: updated.companyName,
        hasBlogContent: updated.hasBlogContent,
        hasAgents: updated.hasAgents,
        hasExistingContent: updated.hasExistingContent,
        hasListings: updated.hasListings,
        hasLogo: updated.hasLogo,
        hasProjects: updated.hasProjects,
        hasTestimonials: updated.hasTestimonials,
        locations: updated.locations,
        primaryGoal: updated.primaryGoal,
        propertyTypes: updated.propertyTypes,
        stylePreference: updated.stylePreference,
        tagline: updated.tagline,
        targetAudience: updated.targetAudience,
        tone: updated.tone,
      };

      const profile = deriveProfile(snapshot);
      const summary = buildBusinessSummary(snapshot);

      await updateOnboardingProfile(db, userId, {
        businessSummary: summary,
        complexity: profile.complexity,
        conversionFocus: profile.conversionFocus,
        designIntent: profile.designIntent,
        recommendedTemplateKey: profile.recommendedTemplateKey,
        segment: profile.segment,
      });

      return { profile, saved: true };
    }),
  getTemplateRecommendations: authenticatedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const onboarding = await findTenantOnboardingByUserId(
      db,
      ctx.auth.session.user.id,
    );

    const profile = onboarding
      ? deriveProfile({
          businessType: onboarding.businessType,
          companyName: onboarding.companyName,
          hasBlogContent: onboarding.hasBlogContent,
          hasAgents: onboarding.hasAgents,
          hasExistingContent: onboarding.hasExistingContent,
          hasListings: onboarding.hasListings,
          hasLogo: onboarding.hasLogo,
          hasProjects: onboarding.hasProjects,
          hasTestimonials: onboarding.hasTestimonials,
          locations: onboarding.locations,
          primaryGoal: onboarding.primaryGoal,
          propertyTypes: onboarding.propertyTypes,
          stylePreference: onboarding.stylePreference,
          tagline: onboarding.tagline,
          targetAudience: onboarding.targetAudience,
          tone: onboarding.tone,
        })
      : null;

    // Starter plan access — only "starter" tier templates are accessible without upgrade
    const accessibleTiers = new Set<string>(["starter"]);

    const recommendations = scoreTemplates(
      profile ?? {
        conversionFocus: "leads",
        designIntent: "editorial",
        segment: "mixed",
      },
      templateCatalog,
      accessibleTiers,
    ).map((r) => ({
      description: r.template.description,
      fallbackKey: r.fallbackKey,
      key: r.template.key,
      name: r.template.name,
      reason: r.reason,
      score: r.score,
      tier: r.template.tier,
      upgradeRequired: r.upgradeRequired,
    }));

    return {
      profile,
      recommendations,
      topKey:
        recommendations.find((r) => !r.upgradeRequired)?.key ?? "template-1",
    };
  }),
  refreshOnboardingProfile: authenticatedProcedure.mutation(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.auth.session.user.id;

    const onboarding = await findTenantOnboardingByUserId(db, userId);
    if (!onboarding) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No onboarding record found.",
      });
    }

    const snapshot = {
      businessType: onboarding.businessType,
      companyName: onboarding.companyName,
      hasBlogContent: onboarding.hasBlogContent,
      hasAgents: onboarding.hasAgents,
      hasExistingContent: onboarding.hasExistingContent,
      hasListings: onboarding.hasListings,
      hasLogo: onboarding.hasLogo,
      hasProjects: onboarding.hasProjects,
      hasTestimonials: onboarding.hasTestimonials,
      locations: onboarding.locations,
      primaryGoal: onboarding.primaryGoal,
      propertyTypes: onboarding.propertyTypes,
      stylePreference: onboarding.stylePreference,
      tagline: onboarding.tagline,
      targetAudience: onboarding.targetAudience,
      tone: onboarding.tone,
    };

    const profile = deriveProfile(snapshot);
    const summary = buildBusinessSummary(snapshot);

    await updateOnboardingProfile(db, userId, {
      businessSummary: summary,
      complexity: profile.complexity,
      conversionFocus: profile.conversionFocus,
      designIntent: profile.designIntent,
      recommendedTemplateKey: profile.recommendedTemplateKey,
      segment: profile.segment,
    });

    return { profile, summary };
  }),

  /**
   * Update core onboarding inputs (business type, primary goal, style, tone)
   * post-onboarding, re-derive profile, and return updated recommendations.
   */
  updateOnboardingInputs: membershipProcedure
    .input(
      z.object({
        businessType: z.string().optional(),
        primaryGoal: z.string().optional(),
        stylePreference: z.string().optional(),
        tone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.auth.session.user.id;

      const onboarding = await findTenantOnboardingByUserId(db, userId);
      if (!onboarding) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No onboarding record found.",
        });
      }

      // Merge new inputs with existing data
      const updated = await saveOnboardingStepProgress(db, {
        userId,
        ...(input.businessType !== undefined
          ? { businessType: input.businessType }
          : {}),
        ...(input.primaryGoal !== undefined
          ? { primaryGoal: input.primaryGoal }
          : {}),
        ...(input.stylePreference !== undefined
          ? { stylePreference: input.stylePreference }
          : {}),
        ...(input.tone !== undefined ? { tone: input.tone } : {}),
      });

      // Re-derive profile
      const snapshot = {
        businessType: updated.businessType,
        companyName: updated.companyName,
        hasBlogContent: updated.hasBlogContent,
        hasAgents: updated.hasAgents,
        hasExistingContent: updated.hasExistingContent,
        hasListings: updated.hasListings,
        hasLogo: updated.hasLogo,
        hasProjects: updated.hasProjects,
        hasTestimonials: updated.hasTestimonials,
        locations: updated.locations,
        primaryGoal: updated.primaryGoal,
        propertyTypes: updated.propertyTypes,
        stylePreference: updated.stylePreference,
        tagline: updated.tagline,
        targetAudience: updated.targetAudience,
        tone: updated.tone,
      };

      const profile = deriveProfile(snapshot);
      const summary = buildBusinessSummary(snapshot);

      await updateOnboardingProfile(db, userId, {
        businessSummary: summary,
        complexity: profile.complexity,
        conversionFocus: profile.conversionFocus,
        designIntent: profile.designIntent,
        recommendedTemplateKey: profile.recommendedTemplateKey,
        segment: profile.segment,
      });

      // Return updated recommendations
      const accessibleTiers = new Set<string>(["starter"]);
      const recommendations = scoreTemplates(
        profile,
        templateCatalog,
        accessibleTiers,
      ).map((r) => ({
        description: r.template.description,
        key: r.template.key,
        name: r.template.name,
        reason: r.reason,
        score: r.score,
        tier: r.template.tier,
        upgradeRequired: r.upgradeRequired,
      }));

      return {
        profile,
        recommendations,
        summary,
        topKey:
          recommendations.find((r) => !r.upgradeRequired)?.key ?? "template-1",
      };
    }),

  /**
   * AI bootstrap: generates hero/intro/CTA copy from onboarding context,
   * updates the active draft WebsiteVersion, and deducts AI credits.
   */
  bootstrapAiContent: membershipProcedure.mutation(async ({ ctx }) => {
    const db = getDb();
    const companyId = ctx.auth.activeMembership.companyId;

    const company = await findCompanyById(db, companyId);
    if (!company) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found.",
      });
    }

    const onboarding = await findTenantOnboardingByUserId(
      db,
      ctx.auth.session.user.id,
    );
    if (!onboarding) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No onboarding record found.",
      });
    }

    // Check credits
    const enough = await hasEnoughCredits(db, companyId, "onboarding_content");
    if (!enough) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "Insufficient AI credits. AI content bootstrap costs 15 credits.",
      });
    }

    // Resolve active draft
    const draft = await resolveActiveDraftForCompany(db, companyId);
    if (!draft) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active draft found. Create a template draft first.",
      });
    }

    await assertTemplateAccessWithLicense(
      db,
      company.id,
      company.planTier,
      draft.templateKey,
    );

    // Generate AI content
    const generated = await generateOnboardingContent({
      businessSummary: onboarding.businessSummary,
      businessType: onboarding.businessType,
      companyName: company.name,
      designIntent: onboarding.designIntent,
      locations: onboarding.locations,
      market: onboarding.market,
      primaryGoal: onboarding.primaryGoal,
      segment: onboarding.segment,
      tagline: onboarding.tagline,
      tone: onboarding.tone,
    });

    if (!generated) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "AI content generation failed. Ensure ANTHROPIC_API_KEY is configured.",
      });
    }

    // Merge AI content into existing draft content
    const mergedContent = {
      ...draft.contentJson,
      ...generated,
    };

    // Update the WebsiteVersion draft
    await updateDraftVersion(db, {
      contentJson: mergedContent,
      updatedById: ctx.auth.session.user.id,
      versionId: draft.id,
    });

    // Also update SiteConfiguration if linked (dual-write)
    if (draft.legacyConfigId) {
      const legacyConfig = await findSiteConfigurationByIdForCompany(db, {
        companyId,
        configId: draft.legacyConfigId,
      });
      if (legacyConfig) {
        for (const [key, value] of Object.entries(generated)) {
          await updateSiteConfigurationContentField(db, {
            configId: legacyConfig.id,
            contentKey: key,
            currentContent: legacyConfig.contentJson as Record<string, string>,
            updatedById: ctx.auth.session.user.id,
            value,
            version: legacyConfig.version,
          });
        }
      }
    }

    // Deduct credits and log usage
    await deductAiCredits(db, {
      companyId,
      feature: "onboarding_content",
    });

    await logAiUsage(db, {
      companyId,
      creditsUsed: 15,
      feature: "onboarding_content",
      meta: { fieldsGenerated: Object.keys(generated) },
      userId: ctx.auth.session.user.id,
    }).catch(() => null);

    return {
      fieldsUpdated: Object.keys(generated),
      success: true,
    };
  }),

  getTemplateCatalog: authenticatedProcedure.query(async () => {
    const db = getDb();
    const usageCounts = await countCompaniesByTemplateKey(db);

    return templateCatalog.map((template) => ({
      description: template.description,
      key: template.key,
      marketingTagline: template.marketingTagline,
      name: template.name,
      previewImageUrl: template.previewImageUrl ?? null,
      purchasable: template.purchasable,
      tier: template.tier,
      usageCount: usageCounts[template.key] ?? 0,
    }));
  }),
  getTemplateLicenses: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const licenses = await findTemplateLicensesForCompany(
      db,
      ctx.auth.activeMembership.companyId,
    );
    return licenses.map((l) => ({
      grantedAt: l.grantedAt,
      source: l.source,
      templateKey: l.templateKey,
    }));
  }),
  /**
   * Claims the free starter-tier template license for the company.
   * Idempotent — calling it multiple times for the same key is safe.
   */
  claimFreeTemplateLicense: membershipProcedure
    .input(
      z.object({
        templateKey: z.string().trim().min(1, "Template key is required."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const template = getTemplateDefinition(input.templateKey);

      if (template.tier !== "starter") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Only starter-tier templates can be claimed as a free pick. Upgrade your plan to access higher-tier templates.",
        });
      }

      await grantTemplateLicense(db, {
        companyId: ctx.auth.activeMembership.companyId,
        grantedById: ctx.auth.session.user.id,
        source: "free",
        templateKey: input.templateKey,
      });

      return { granted: true, templateKey: input.templateKey };
    }),
  /**
   * Syncs plan-included template licenses based on the company's current plan tier.
   * Call this after a subscription change (upgrade/downgrade).
   */
  syncPlanLicenses: membershipProcedure.mutation(async ({ ctx }) => {
    const db = getDb();
    const company = await findCompanyById(
      db,
      ctx.auth.activeMembership.companyId,
    );

    if (!company) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Company not found." });
    }

    const { canAccessTemplateTier } = await import("@plotkeys/utils");

    const allowedKeys = templateCatalog
      .filter((t) =>
        canAccessTemplateTier(
          company.planTier as "starter" | "plus" | "pro",
          t.tier,
        ),
      )
      .map((t) => t.key);

    await syncPlanIncludedLicenses(
      db,
      ctx.auth.activeMembership.companyId,
      allowedKeys,
    );

    const updatedKeys = await findLicensedTemplateKeys(
      db,
      ctx.auth.activeMembership.companyId,
    );

    return { licensedTemplateKeys: [...updatedKeys] };
  }),
  /**
   * Upgrade or downgrade the company subscription plan.
   *
   * On upgrade: syncs plan-included template licenses to the new, wider set.
   * On downgrade: syncs licenses to the narrower set (revokes unlicensed templates).
   *
   * In production this is called by a billing webhook handler after the
   * payment provider confirms the subscription change. The `providerRef` field
   * stores the billing provider's subscription ID for reconciliation.
   */
  changePlan: membershipProcedure
    .input(changePlanInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const companyId = ctx.auth.activeMembership.companyId;

      // Persist the new plan tier and status
      const company = await updateCompanyPlan(
        db,
        companyId,
        input.planTier,
        input.planStatus,
      );

      // Store the provider reference in a billing line item if provided
      if (input.providerRef) {
        await db.billingLineItem
          .upsert({
            create: {
              amountMinorUnits: 0,
              companyId,
              currency: "NGN",
              kind: "subscription",
              meta: { providerRef: input.providerRef },
              providerRef: input.providerRef,
              status: input.planStatus === "active" ? "active" : "cancelled",
            },
            update: {
              meta: { providerRef: input.providerRef },
              status: input.planStatus === "active" ? "active" : "cancelled",
            },
            where: {
              // Fall back to a synthetic unique check — provider refs are unique per company
              id: "00000000-0000-0000-0000-000000000000",
            },
          })
          .catch(() => {
            // Upsert by providerRef isn't directly supported — insert separately
            return db.billingLineItem
              .create({
                data: {
                  amountMinorUnits: 0,
                  companyId,
                  currency: "NGN",
                  kind: "subscription",
                  meta: { providerRef: input.providerRef },
                  providerRef: input.providerRef,
                  status:
                    input.planStatus === "active" ? "active" : "cancelled",
                },
              })
              .catch(() => null); // Non-fatal if billing record fails
          });
      }

      // Sync plan-included template licenses to match the new tier
      const { canAccessTemplateTier } = await import("@plotkeys/utils");
      const allowedKeys = templateCatalog
        .filter((t) => canAccessTemplateTier(input.planTier, t.tier))
        .map((t) => t.key);

      await syncPlanIncludedLicenses(db, companyId, allowedKeys);

      return {
        companyId,
        planStatus: company.planStatus,
        planTier: company.planTier,
      };
    }),
  createTemplateDraft: membershipProcedure
    .input(createTemplateDraftInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const company = await findCompanyById(
        db,
        ctx.auth.activeMembership.companyId,
      );

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found.",
        });
      }

      await assertTemplateAccessWithLicense(
        db,
        company.id,
        company.planTier,
        input.templateKey,
      );

      const existingDraft = await findLatestDraftForTemplate(db, {
        companyId: company.id,
        templateKey: input.templateKey,
      });

      if (existingDraft) {
        return {
          configId: existingDraft.id,
        };
      }

      const initialSiteConfiguration = createInitialSiteConfigurationInput({
        companyName: company.name,
        market: company.market ?? company.name,
        subdomain: company.slug,
        templateKey: input.templateKey,
      });

      const configuration = await createSiteConfiguration(db, {
        ...initialSiteConfiguration,
        companyId: company.id,
        createdById: ctx.auth.session.user.id,
        updatedById: ctx.auth.session.user.id,
      });

      return {
        configId: configuration.id,
      };
    }),
  ensureBuilderConfigurationExists: membershipProcedure.mutation(
    async ({ ctx }) => {
      const db = getDb();
      const configuration = await findLatestSiteConfigurationForCompany(
        db,
        ctx.auth.activeMembership.companyId,
      );

      if (configuration) {
        return {
          configId: configuration.id,
        };
      }

      const company = await findCompanyById(
        db,
        ctx.auth.activeMembership.companyId,
      );

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found.",
        });
      }

      const initialSiteConfiguration = createInitialSiteConfigurationInput({
        companyName: company.name,
        market: company.market ?? company.name,
        subdomain: company.slug,
        templateKey: getTemplateDefinition("template-1").key,
      });

      const createdConfiguration = await createSiteConfiguration(db, {
        ...initialSiteConfiguration,
        companyId: company.id,
        createdById: ctx.auth.session.user.id,
        publishedAt: new Date(),
        status: "published",
        updatedById: ctx.auth.session.user.id,
      });

      return {
        configId: createdConfiguration.id,
      };
    },
  ),
  publishSiteConfiguration: membershipProcedure
    .input(publishSiteConfigurationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId: ctx.auth.activeMembership.companyId,
        configId: input.configId,
      });

      if (!configuration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template configuration not found.",
        });
      }

      await assertCompanyCanUseTemplate(
        db,
        ctx.auth.activeMembership.companyId,
        configuration.templateKey,
      );

      await publishSiteConfiguration(db, {
        companyId: ctx.auth.activeMembership.companyId,
        configId: configuration.id,
        currentName: configuration.name,
        nextName: input.nextName,
        updatedById: ctx.auth.session.user.id,
        version: configuration.version,
      });

      return {
        configId: configuration.id,
      };
    }),
  smartFillField: membershipProcedure
    .input(smartFillFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId: ctx.auth.activeMembership.companyId,
        configId: input.configId,
      });

      if (!configuration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template configuration not found.",
        });
      }

      await assertCompanyCanUseTemplate(
        db,
        ctx.auth.activeMembership.companyId,
        configuration.templateKey,
      );

      const company = await findCompanyById(
        db,
        ctx.auth.activeMembership.companyId,
      );

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found.",
        });
      }

      // Fetch the onboarding record for business context (optional — enriches the prompt)
      const onboarding = await findTenantOnboardingByUserId(
        db,
        ctx.auth.session.user.id,
      );

      const aiSuggestion = await generateFieldContent({
        businessSummary: onboarding?.businessSummary,
        companyName: company.name,
        contentKey: input.contentKey,
        longDetail: input.longDetail,
        market: onboarding?.market ?? company.market,
        preferredLength: input.preferredLength,
        shortDetail: input.shortDetail,
        templateKey: configuration.templateKey,
      });

      // Deduct credits if AI was actually used
      if (aiSuggestion) {
        const deducted = await deductAiCredits(db, {
          companyId: ctx.auth.activeMembership.companyId,
          feature: "smart_fill",
        });

        await logAiUsage(db, {
          companyId: ctx.auth.activeMembership.companyId,
          creditsUsed: deducted ? 2 : 0,
          feature: "smart_fill",
          meta: { contentKey: input.contentKey },
          userId: ctx.auth.session.user.id,
        }).catch(() => null);
      }

      // Fall back to deterministic placeholder when ANTHROPIC_API_KEY is absent
      const suggestion =
        aiSuggestion ??
        (input.contentKey === "hero.title"
          ? `${company.name} unlocks better moves.`
          : `${input.shortDetail} for ${company.name}.`);

      await updateSiteConfigurationContentField(db, {
        configId: configuration.id,
        contentKey: input.contentKey,
        currentContent: configuration.contentJson as Record<string, string>,
        updatedById: ctx.auth.session.user.id,
        value: suggestion,
        version: configuration.version,
      });

      return {
        configId: configuration.id,
      };
    }),
  syncTenantDomains: membershipProcedure.mutation(async ({ ctx }) => {
    const db = getDb();

    if (!isVercelDomainProvisioningConfigured()) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Vercel domain provisioning env vars are not configured.",
      });
    }

    const domains = await listSyncableTenantDomains(
      db,
      ctx.auth.activeMembership.companyId,
    );

    if (domains.length === 0) {
      return { queued: false, queuedCount: 0 };
    }

    // Queue domain sync as a background job with exponential backoff retries
    await triggerJob(
      domainSyncTask,
      domainSyncHandler,
      { companyId: ctx.auth.activeMembership.companyId },
      {
        baseDelayMs: 2000,
        maxAttempts: 4,
      },
    );

    return { queued: true, queuedCount: domains.length };
  }),
  getTenantDomainStatus: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const domains = await listTenantDomainsForCompany(
      db,
      ctx.auth.activeMembership.companyId,
    );

    const hasFailure = domains.some((d) => d.status === "failed");
    const allProvisioned = domains.every((d) => d.status === "active");

    return {
      domains: domains.map((d) => ({
        hostname: d.hostname,
        id: d.id,
        kind: d.kind,
        lastError: d.lastError,
        provisionedAt: d.provisionedAt,
        status: d.status,
      })),
      hasFailure,
      allProvisioned,
    };
  }),
  updateSiteField: membershipProcedure
    .input(updateSiteFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId: ctx.auth.activeMembership.companyId,
        configId: input.configId,
      });

      if (!configuration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template configuration not found.",
        });
      }

      await assertCompanyCanUseTemplate(
        db,
        ctx.auth.activeMembership.companyId,
        configuration.templateKey,
      );

      await updateSiteConfigurationContentField(db, {
        configId: configuration.id,
        contentKey: input.contentKey,
        currentContent: configuration.contentJson as Record<string, string>,
        updatedById: ctx.auth.session.user.id,
        value: input.value,
        version: configuration.version,
      });

      return {
        configId: configuration.id,
      };
    }),
  updateSiteThemeField: membershipProcedure
    .input(
      z.object({
        configId: z.string().trim().min(1, "Configuration id is required."),
        themeKey: z.string().trim().min(1, "Theme key is required."),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId: ctx.auth.activeMembership.companyId,
        configId: input.configId,
      });

      if (!configuration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template configuration not found.",
        });
      }

      await assertCompanyCanUseTemplate(
        db,
        ctx.auth.activeMembership.companyId,
        configuration.templateKey,
      );

      await updateSiteConfigurationThemeField(db, {
        configId: configuration.id,
        currentTheme: configuration.themeJson as Record<string, string>,
        themeKey: input.themeKey,
        updatedById: ctx.auth.session.user.id,
        value: input.value,
        version: configuration.version,
      });

      return { configId: configuration.id };
    }),
  getSiteRenderData: publicProcedure
    .input(
      z.object({
        subdomain: z.string().trim().min(1, "Subdomain is required."),
      }),
    )
    .query(async ({ input }) => {
      const db = getDb();

      const company = await findCompanyBySlug(db, input.subdomain);
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No workspace found for subdomain "${input.subdomain}".`,
        });
      }

      const [configuration, featuredProperties] = await Promise.all([
        findLatestSiteConfigurationForCompany(db, company.id),
        listFeaturedProperties(db, company.id),
      ]);

      if (!configuration) {
        return null;
      }

      const liveListings = featuredProperties.map((p) => ({
        imageUrl: p.imageUrl,
        location: p.location,
        price: p.price,
        specs:
          p.specs ??
          ([
            p.bedrooms ? `${p.bedrooms} bed` : null,
            p.bathrooms ? `${p.bathrooms} bath` : null,
          ]
            .filter(Boolean)
            .join(" • ") ||
            null),
        title: p.title,
      }));

      return {
        companyId: company.id,
        companyName: company.name,
        configId: configuration.id,
        content: configuration.contentJson as Record<string, string>,
        liveListings,
        market: company.market,
        status: configuration.status,
        subdomain: input.subdomain,
        templateKey: configuration.templateKey,
        theme: configuration.themeJson as Record<string, string>,
        version: configuration.version,
      };
    }),
  /**
   * Persist the company logo URL.
   *
   * The caller is responsible for uploading the file to storage (e.g. Supabase
   * Storage, Cloudinary, S3) and providing the public URL. Pass `null` to clear
   * the logo.
   *
   * AI-assisted logo generation (e.g. DALL-E prompt → storage) would call this
   * procedure after writing the generated image to the storage bucket.
   */
  setCompanyLogo: membershipProcedure
    .input(
      z.object({
        logoUrl: z.string().url("A valid URL is required.").nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const company = await updateCompanyLogo(
        db,
        ctx.auth.activeMembership.companyId,
        input.logoUrl,
      );
      return { companyId: company.id, logoUrl: company.logoUrl };
    }),

  updateCompanyProfile: membershipProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).optional(),
        market: z.string().trim().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      assertMinRole(ctx.auth.activeMembership.role, "admin");
      return updateCompanyProfile(
        db,
        ctx.auth.activeMembership.companyId,
        input,
      );
    }),

  // ─── Properties ───────────────────────────────────────────────────────────

  listProperties: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return listPropertiesForCompany(db, ctx.auth.activeMembership.companyId, {
      limit: 100,
    });
  }),

  createProperty: membershipProcedure
    .input(
      z.object({
        title: z.string().trim().min(1, "Title is required."),
        description: z.string().trim().optional().nullable(),
        price: z.string().trim().optional().nullable(),
        location: z.string().trim().optional().nullable(),
        bedrooms: z.number().int().nonnegative().optional().nullable(),
        bathrooms: z.number().int().nonnegative().optional().nullable(),
        specs: z.string().trim().optional().nullable(),
        imageUrl: z.string().url().optional().nullable(),
        type: z
          .enum([
            "residential",
            "commercial",
            "land",
            "industrial",
            "mixed_use",
          ])
          .optional()
          .nullable(),
        subType: z.string().trim().optional().nullable(),
        status: z
          .enum(["active", "sold", "rented", "off_market"])
          .optional()
          .default("active"),
        featured: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      return createProperty(db, {
        companyId: ctx.auth.activeMembership.companyId,
        ...input,
      });
    }),

  updateProperty: membershipProcedure
    .input(
      z.object({
        propertyId: z.string().trim().min(1),
        title: z.string().trim().min(1).optional(),
        description: z.string().trim().optional().nullable(),
        price: z.string().trim().optional().nullable(),
        location: z.string().trim().optional().nullable(),
        bedrooms: z.number().int().nonnegative().optional().nullable(),
        bathrooms: z.number().int().nonnegative().optional().nullable(),
        specs: z.string().trim().optional().nullable(),
        imageUrl: z.string().url().optional().nullable(),
        type: z
          .enum([
            "residential",
            "commercial",
            "land",
            "industrial",
            "mixed_use",
          ])
          .optional()
          .nullable(),
        subType: z.string().trim().optional().nullable(),
        status: z.enum(["active", "sold", "rented", "off_market"]).optional(),
        featured: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { propertyId, ...data } = input;
      return updateProperty(
        db,
        propertyId,
        ctx.auth.activeMembership.companyId,
        data,
      );
    }),

  deleteProperty: membershipProcedure
    .input(z.object({ propertyId: z.string().trim().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await deleteProperty(
        db,
        input.propertyId,
        ctx.auth.activeMembership.companyId,
      );
      return { deleted: true };
    }),

  togglePropertyFeatured: membershipProcedure
    .input(z.object({ propertyId: z.string().trim().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await togglePropertyFeatured(
        db,
        input.propertyId,
        ctx.auth.activeMembership.companyId,
      );
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found.",
        });
      }
      return { featured: result.featured, propertyId: result.id };
    }),

  // ─── Agents ───────────────────────────────────────────────────────────────

  listAgents: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return listAgentsForCompany(db, ctx.auth.activeMembership.companyId, {
      limit: 100,
    });
  }),

  createAgent: membershipProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Name is required."),
        title: z.string().trim().optional().nullable(),
        bio: z.string().trim().optional().nullable(),
        email: z.string().email().optional().nullable(),
        phone: z.string().trim().optional().nullable(),
        imageUrl: z.string().url().optional().nullable(),
        featured: z.boolean().optional().default(false),
        displayOrder: z.number().int().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      return createAgent(db, {
        companyId: ctx.auth.activeMembership.companyId,
        ...input,
      });
    }),

  updateAgent: membershipProcedure
    .input(
      z.object({
        agentId: z.string().trim().min(1),
        name: z.string().trim().min(1).optional(),
        title: z.string().trim().optional().nullable(),
        bio: z.string().trim().optional().nullable(),
        email: z.string().email().optional().nullable(),
        phone: z.string().trim().optional().nullable(),
        imageUrl: z.string().url().optional().nullable(),
        featured: z.boolean().optional(),
        displayOrder: z.number().int().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { agentId, ...data } = input;
      return updateAgent(
        db,
        agentId,
        ctx.auth.activeMembership.companyId,
        data,
      );
    }),

  deleteAgent: membershipProcedure
    .input(z.object({ agentId: z.string().trim().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await deleteAgent(db, input.agentId, ctx.auth.activeMembership.companyId);
      return { deleted: true };
    }),

  toggleAgentFeatured: membershipProcedure
    .input(z.object({ agentId: z.string().trim().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await toggleAgentFeatured(
        db,
        input.agentId,
        ctx.auth.activeMembership.companyId,
      );
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found." });
      }
      return { agentId: result.id, featured: result.featured };
    }),
  listLeads: membershipProcedure
    .input(
      z
        .object({
          status: z
            .enum(["new", "contacted", "qualified", "closed"])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return listLeadsForCompany(db, ctx.auth.activeMembership.companyId, {
        status: input?.status,
        limit: 100,
      });
    }),
  getLeadStats: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return countLeadsByStatus(db, ctx.auth.activeMembership.companyId);
  }),
  updateLeadStatus: membershipProcedure
    .input(updateLeadStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const lead = await updateLeadStatus(db, {
        leadId: input.leadId,
        notes: input.notes,
        status: input.status,
      });
      return { leadId: lead.id, status: lead.status };
    }),

  // ─── Billing ──────────────────────────────────────────────────────────

  getBillingInfo: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const companyId = ctx.auth.activeMembership.companyId;

    const company = await findCompanyById(db, companyId);
    if (!company)
      throw new TRPCError({ code: "NOT_FOUND", message: "Company not found." });

    const recentItems = await db.billingLineItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      where: { companyId },
    });

    return {
      planEndsAt: company.planEndsAt,
      planStartedAt: company.planStartedAt,
      planStatus: company.planStatus,
      planTier: company.planTier,
      recentItems: recentItems.map((item) => ({
        amount: item.amountMinorUnits,
        createdAt: item.createdAt,
        currency: item.currency,
        id: item.id,
        kind: item.kind,
        paidAt: item.paidAt,
        providerRef: item.providerRef,
        status: item.status,
      })),
    };
  }),

  initializeCheckout: membershipProcedure
    .input(initializeCheckoutInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { initializeTransaction, getPlanPricing } = await import(
        "@plotkeys/utils"
      );

      const companyId = ctx.auth.activeMembership.companyId;
      const db = getDb();
      const company = await findCompanyById(db, companyId);
      if (!company)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found.",
        });

      const pricing = getPlanPricing(input.planTier);
      const price =
        input.interval === "monthly" ? pricing.monthly : pricing.annual;

      if (price.minorUnits === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot checkout for a free plan.",
        });
      }

      const callbackUrl =
        input.callbackUrl ??
        `${process.env.DASHBOARD_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3901"}/billing/callback`;
      const checkoutEmail =
        process.env.NODE_ENV === "development" && process.env.TEST_EMAIL
          ? process.env.TEST_EMAIL
          : (ctx.auth.session.user.email ?? "");

      if (!checkoutEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A billing email address is required to start checkout.",
        });
      }

      const tx = await initializeTransaction({
        amount: price.minorUnits,
        callbackUrl,
        email: checkoutEmail,
        metadata: {
          companyId,
          interval: input.interval,
          planTier: input.planTier,
        },
      });

      // Record a pending billing line item
      await db.billingLineItem
        .create({
          data: {
            amountMinorUnits: price.minorUnits,
            companyId,
            currency: "NGN",
            kind: "subscription",
            meta: { interval: input.interval, planTier: input.planTier },
            providerRef: tx.reference,
            status: "pending",
          },
        })
        .catch(() => null);

      return {
        authorizationUrl: tx.authorization_url,
        reference: tx.reference,
      };
    }),

  // ─── Appointments ─────────────────────────────────────────────────────

  listAppointments: membershipProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          upcoming: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return listAppointmentsForCompany(
        db,
        ctx.auth.activeMembership.companyId,
        { status: input?.status, upcoming: input?.upcoming, limit: 50 },
      );
    }),

  getAppointmentStats: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return countAppointmentsByStatus(db, ctx.auth.activeMembership.companyId);
  }),

  createAppointment: membershipProcedure
    .input(createAppointmentInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      return createAppointment(db, {
        agentId: input.agentId,
        companyId: ctx.auth.activeMembership.companyId,
        email: input.email,
        leadId: input.leadId,
        location: input.location,
        name: input.name,
        notes: input.notes,
        phone: input.phone,
        propertyId: input.propertyId,
        scheduledAt: new Date(input.scheduledAt),
      });
    }),

  updateAppointmentStatus: membershipProcedure
    .input(updateAppointmentStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      return updateAppointmentStatus(db, {
        appointmentId: input.appointmentId,
        notes: input.notes,
        status: input.status,
      });
    }),

  deleteAppointment: membershipProcedure
    .input(z.object({ appointmentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      return deleteAppointment(db, input.appointmentId);
    }),

  // ─── Stock Images ─────────────────────────────────────────────────────

  listStockImageLicenses: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return listStockImageLicensesForCompany(
      db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  purchaseStockImage: membershipProcedure
    .input(z.object({ imageId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const companyId = ctx.auth.activeMembership.companyId;
      const { getStockImageById } = await import("@plotkeys/section-registry");
      const { stockImagePrice } = await import("@plotkeys/utils");

      const image = getStockImageById(input.imageId);
      if (!image) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Image not found." });
      }

      if (image.licenseTier === "free") {
        // Free images don't need purchase
        await grantStockImageLicense(db, { companyId, imageId: input.imageId });
        return { granted: true, imageId: input.imageId };
      }

      const alreadyLicensed = await hasStockImageLicense(
        db,
        companyId,
        input.imageId,
      );
      if (alreadyLicensed) {
        return { granted: true, imageId: input.imageId };
      }

      // Record billing line item and grant license
      await db.billingLineItem.create({
        data: {
          amountMinorUnits: stockImagePrice.minorUnits,
          companyId,
          currency: "NGN",
          kind: "stock_image",
          meta: { imageId: input.imageId, imageTitle: image.title },
          paidAt: new Date(),
          status: "active",
        },
      });

      await grantStockImageLicense(db, { companyId, imageId: input.imageId });

      return { granted: true, imageId: input.imageId };
    }),

  // ─── AI Credits ───────────────────────────────────────────────────────

  getAiCreditInfo: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const companyId = ctx.auth.activeMembership.companyId;

    const [balance, usage] = await Promise.all([
      getAiCreditBalance(db, companyId),
      getAiUsageStats(db, companyId),
    ]);

    return { balance, ...usage };
  }),

  purchaseAiCredits: membershipProcedure.mutation(async ({ ctx }) => {
    const db = getDb();
    const companyId = ctx.auth.activeMembership.companyId;
    const { aiCreditsBlockPrice } = await import("@plotkeys/utils");

    // Record billing
    const item = await db.billingLineItem.create({
      data: {
        amountMinorUnits: aiCreditsBlockPrice.minorUnits,
        companyId,
        currency: "NGN",
        kind: "ai_credits",
        meta: { credits: aiCreditsBlockPrice.creditsPerBlock },
        paidAt: new Date(),
        status: "active",
      },
    });

    // Grant credits
    await grantAiCredits(db, {
      amount: aiCreditsBlockPrice.creditsPerBlock,
      companyId,
      description: `Top-up: ${aiCreditsBlockPrice.creditsPerBlock} credits`,
      reason: "top_up",
      referenceId: item.id,
    });

    return { credited: aiCreditsBlockPrice.creditsPerBlock };
  }),

  // ─── Analytics ──────────────────────────────────────────────────────

  getAnalytics: membershipProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const companyId = ctx.auth.activeMembership.companyId;

    const [summary, pageViewsByDay] = await Promise.all([
      getAnalyticsSummary(db, companyId),
      getPageViewsByDay(db, companyId, 30),
    ]);

    return { ...summary, pageViewsByDay };
  }),
});
