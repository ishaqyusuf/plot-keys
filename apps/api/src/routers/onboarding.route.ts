import type { Db } from "@plotkeys/db";
import {
  completeTenantOnboarding,
  createCompanyOnboardingBundle,
  findCompanyBySlug,
  findTenantOnboardingByUserId,
  grantTemplateLicense,
  saveOnboardingStepProgress,
  updateOnboardingProfile,
} from "@plotkeys/db/queries";
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
} from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";

import {
  createNotificationService,
  type NotificationUser,
} from "../lib.notification-service";
import {
  authenticatedProcedure,
  createTRPCRouter,
  membershipProcedure,
} from "../lib.trpc";
import {
  completeOnboardingInputSchema,
  saveOnboardingProgressInputSchema,
  updateOnboardingInputsSchema,
} from "../schemas/onboarding.schema";

const reservedSubdomains = new Set([
  "admin",
  "api",
  "app",
  "dashboard",
  "mail",
  "support",
  "www",
]);

type OnboardingRecord = NonNullable<
  Awaited<ReturnType<typeof findTenantOnboardingByUserId>>
>;

function requireDb(db: Db | null): Db {
  if (!db) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Database is unavailable.",
    });
  }

  return db;
}

function getProfileSnapshot(onboarding: OnboardingRecord) {
  return {
    businessType: onboarding.businessType,
    companyName: onboarding.companyName,
    hasAgents: onboarding.hasAgents,
    hasBlogContent: onboarding.hasBlogContent,
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
}

async function deriveAndPersistProfile(
  db: Db,
  userId: string,
  onboarding: OnboardingRecord,
) {
  const snapshot = getProfileSnapshot(onboarding);
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
}

function getStarterRecommendations(
  profile: Parameters<typeof scoreTemplates>[0],
) {
  return scoreTemplates(profile, templateCatalog, new Set<string>(["starter"]));
}

async function assertSubdomainAvailability(db: Db, subdomain: string) {
  if (subdomain.length < 3) {
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

  if (await findCompanyBySlug(db, subdomain)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "That subdomain is already in use.",
    });
  }
}

function assertStarterTemplateAccess(templateKey: string) {
  const template = getTemplateDefinition(templateKey);
  const access = describeTemplateAccess("starter", template.tier);

  if (!access.allowed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: access.message,
    });
  }
}

function queueSignupSuccessfulNotification(input: {
  companyId: string;
  companyName: string;
  dashboardHostname: string;
  siteHostname: string;
  subdomain: string;
  user: NotificationUser;
}) {
  if (!input.user.email) {
    return;
  }

  void createNotificationService({
    companyId: input.companyId,
    user: input.user,
  })
    .send("signup_successful", {
      channels: ["in_app"],
      payload: {
        companyName: input.companyName,
        dashboardHostname: input.dashboardHostname,
        email: input.user.email,
        fullName: input.user.name ?? input.user.email,
        siteHostname: input.siteHostname,
        subdomain: input.subdomain,
      },
    })
    .catch(() => {
      // Notification delivery is non-blocking for onboarding completion.
    });
}

export const onboardingRouter = createTRPCRouter({
  complete: authenticatedProcedure
    .input(completeOnboardingInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = requireDb(ctx.db.db);

      if (ctx.auth.activeMembership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Onboarding has already been completed for this user.",
        });
      }

      const userId = ctx.auth.session.user.id;
      const savedOnboarding = await findTenantOnboardingByUserId(db, userId);
      const companyName = savedOnboarding?.companyName ?? input.companyName;
      const logoUrl = input.logoUrl ?? null;
      const subdomain = savedOnboarding?.subdomain ?? input.subdomain;

      await assertSubdomainAvailability(db, subdomain);
      assertStarterTemplateAccess(input.templateKey);

      const snapshot = savedOnboarding
        ? getProfileSnapshot(savedOnboarding)
        : null;
      const profile = snapshot ? deriveProfile(snapshot) : null;
      const designConfig =
        profile && snapshot ? deriveDesignConfig(profile, snapshot) : null;
      const personalizedContent =
        profile && snapshot
          ? derivePersonalizedContent(
              {
                ...snapshot,
                locations: [input.market, ...(snapshot.locations ?? [])],
              },
              profile,
            )
          : null;
      const template = getTemplateDefinition(input.templateKey);
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
                ...(logoUrl ? { logoUrl } : {}),
                market: input.market,
              },
            }
          : createInitialSiteConfigurationInput({
              companyName,
              market: input.market,
              subdomain,
              templateKey: input.templateKey,
            });

      if (logoUrl) {
        initialSiteConfiguration.themeJson = {
          ...initialSiteConfiguration.themeJson,
          logoUrl,
        };
      }

      const dashboardHostname = buildDashboardHostname(subdomain);
      const sitefrontHostname = buildSitefrontHostname(subdomain);
      const siteConfiguration = await createCompanyOnboardingBundle(db, {
        apexDomain: plotkeysRootDomain,
        companyName,
        createdById: userId,
        dashboardHostname,
        initialSiteConfiguration,
        logoUrl,
        market: input.market,
        sitefrontHostname,
        subdomain,
      });

      await completeTenantOnboarding(db, userId);
      await grantTemplateLicense(db, {
        companyId: siteConfiguration.companyId,
        grantedById: userId,
        source: "free",
        templateKey: input.templateKey,
      });

      queueSignupSuccessfulNotification({
        companyId: siteConfiguration.companyId,
        companyName,
        dashboardHostname,
        siteHostname: sitefrontHostname,
        subdomain,
        user: ctx.auth.session.user,
      });

      if (isVercelDomainProvisioningConfigured()) {
        triggerJob(
          domainSyncTask,
          domainSyncHandler,
          { companyId: siteConfiguration.companyId },
          { baseDelayMs: 2000, maxAttempts: 4 },
        ).catch(() => {
          // Domain sync failures remain retryable from the dashboard.
        });
      }

      return { configId: siteConfiguration.id };
    }),

  get: authenticatedProcedure.query(async ({ ctx }) => {
    const onboarding = await findTenantOnboardingByUserId(
      requireDb(ctx.db.db),
      ctx.auth.session.user.id,
    );

    if (!onboarding) {
      return null;
    }

    return {
      businessSummary: onboarding.businessSummary,
      businessType: onboarding.businessType,
      companyName: onboarding.companyName,
      completedAt: onboarding.completedAt,
      complexity: onboarding.complexity,
      contactEmail: onboarding.contactEmail,
      conversionFocus: onboarding.conversionFocus,
      currentStep: onboarding.currentStep,
      designIntent: onboarding.designIntent,
      hasAgents: onboarding.hasAgents,
      hasBlogContent: onboarding.hasBlogContent,
      hasExistingContent: onboarding.hasExistingContent,
      hasListings: onboarding.hasListings,
      hasLogo: onboarding.hasLogo,
      hasProjects: onboarding.hasProjects,
      hasTestimonials: onboarding.hasTestimonials,
      locations: onboarding.locations,
      market: onboarding.market,
      officeAddress: onboarding.officeAddress,
      phone: onboarding.phone,
      preferredColorHint: onboarding.preferredColorHint,
      primaryGoal: onboarding.primaryGoal,
      propertyTypes: onboarding.propertyTypes,
      recommendedTemplateKey: onboarding.recommendedTemplateKey,
      segment: onboarding.segment,
      stylePreference: onboarding.stylePreference,
      subdomain: onboarding.subdomain,
      tagline: onboarding.tagline,
      targetAudience: onboarding.targetAudience,
      templateKey: onboarding.templateKey,
      tone: onboarding.tone,
      whatsapp: onboarding.whatsapp,
    };
  }),

  recommendations: authenticatedProcedure.query(async ({ ctx }) => {
    const onboarding = await findTenantOnboardingByUserId(
      requireDb(ctx.db.db),
      ctx.auth.session.user.id,
    );
    const profile = onboarding
      ? deriveProfile(getProfileSnapshot(onboarding))
      : null;
    const recommendations = getStarterRecommendations(
      profile ?? {
        conversionFocus: "leads",
        designIntent: "editorial",
        segment: "mixed",
      },
    ).map((result) => ({
      description: result.template.description,
      fallbackKey: result.fallbackKey,
      key: result.template.key,
      name: result.template.name,
      reason: result.reason,
      score: result.score,
      tier: result.template.tier,
      upgradeRequired: result.upgradeRequired,
    }));

    return {
      profile,
      recommendations,
      topKey:
        recommendations.find((result) => !result.upgradeRequired)?.key ??
        "template-1",
    };
  }),

  refreshProfile: authenticatedProcedure.mutation(async ({ ctx }) => {
    const db = requireDb(ctx.db.db);
    const userId = ctx.auth.session.user.id;
    const onboarding = await findTenantOnboardingByUserId(db, userId);

    if (!onboarding) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No onboarding record found.",
      });
    }

    return deriveAndPersistProfile(db, userId, onboarding);
  }),

  saveProgress: authenticatedProcedure
    .input(saveOnboardingProgressInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = requireDb(ctx.db.db);
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
      const { profile } = await deriveAndPersistProfile(db, userId, updated);

      return { profile, saved: true };
    }),

  updateInputs: membershipProcedure
    .input(updateOnboardingInputsSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.session.user.id;
      const onboarding = await findTenantOnboardingByUserId(ctx.db.db, userId);

      if (!onboarding) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No onboarding record found.",
        });
      }

      const updated = await saveOnboardingStepProgress(ctx.db.db, {
        userId,
        ...input,
      });
      const { profile, summary } = await deriveAndPersistProfile(
        ctx.db.db,
        userId,
        updated,
      );
      const recommendations = getStarterRecommendations(profile).map(
        (result) => ({
          description: result.template.description,
          key: result.template.key,
          name: result.template.name,
          reason: result.reason,
          score: result.score,
          tier: result.template.tier,
          upgradeRequired: result.upgradeRequired,
        }),
      );

      return {
        profile,
        recommendations,
        summary,
        topKey:
          recommendations.find((result) => !result.upgradeRequired)?.key ??
          "template-1",
      };
    }),
});
