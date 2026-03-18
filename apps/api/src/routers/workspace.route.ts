import {
  completeTenantOnboarding,
  countCompaniesByTemplateKey,
  createCompanyOnboardingBundle,
  createPrismaClient,
  createSiteConfiguration,
  type Db,
  findCompanyById,
  findCompanyBySlug,
  findLatestDraftForTemplate,
  findLatestSiteConfigurationForCompany,
  findLicensedTemplateKeys,
  findSiteConfigurationByIdForCompany,
  findTenantOnboardingByUserId,
  findTemplateLicensesForCompany,
  grantTemplateLicense,
  hasTemplateLicense,
  listSyncableTenantDomains,
  listTenantDomainsForCompany,
  publishSiteConfiguration,
  saveOnboardingStepProgress,
  syncPlanIncludedLicenses,
  updateOnboardingProfile,
  updateSiteConfigurationContentField,
  updateSiteConfigurationThemeField,
  upsertTenantOnboarding,
} from "@plotkeys/db";
import { domainSyncHandler, runInBackground } from "@plotkeys/jobs";
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

import {
  authenticatedProcedure,
  createTRPCRouter,
  membershipProcedure,
} from "../lib.trpc";
import { generateFieldContent } from "../lib.ai";
import {
  completeOnboardingInputSchema,
  createTemplateDraftInputSchema,
  publishSiteConfigurationInputSchema,
  saveOnboardingProgressInputSchema,
  smartFillFieldInputSchema,
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
  const licensed = await hasTemplateLicense(db, companyId, templateKey);
  if (licensed) return; // explicit license overrides plan-tier gating
  assertTemplateAccess(planTier, templateKey);
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
              { ...snapshot, locations: [market, ...(snapshot.locations ?? [])] },
              profile,
            )
          : null;

      const template = getTemplateDefinition(templateKey);

      const initialSiteConfiguration = personalizedContent && designConfig
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

      const updated = await saveOnboardingStepProgress(db, { userId, ...input });

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
      z.object({ templateKey: z.string().trim().min(1, "Template key is required.") }),
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
      .filter((t) => canAccessTemplateTier(company.planTier as "starter" | "plus" | "pro", t.tier))
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
    await runInBackground(
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
  getSiteRenderData: authenticatedProcedure
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

      const configuration = await findLatestSiteConfigurationForCompany(
        db,
        company.id,
      );

      if (!configuration) {
        return null;
      }

      return {
        companyId: company.id,
        companyName: company.name,
        configId: configuration.id,
        content: configuration.contentJson as Record<string, string>,
        market: company.market,
        status: configuration.status,
        subdomain: input.subdomain,
        templateKey: configuration.templateKey,
        theme: configuration.themeJson as Record<string, string>,
        version: configuration.version,
      };
    }),
});
