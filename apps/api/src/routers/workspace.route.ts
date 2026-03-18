import {
  completeTenantOnboarding,
  createCompanyOnboardingBundle,
  createPrismaClient,
  createSiteConfiguration,
  type Db,
  findCompanyById,
  findCompanyBySlug,
  findLatestDraftForTemplate,
  findLatestSiteConfigurationForCompany,
  findSiteConfigurationByIdForCompany,
  findTenantOnboardingByUserId,
  listSyncableTenantDomains,
  publishSiteConfiguration,
  updateSiteConfigurationContentField,
  upsertTenantOnboarding,
} from "@plotkeys/db";
import { domainSyncHandler, runInBackground } from "@plotkeys/jobs";
import {
  createInitialSiteConfigurationInput,
  getTemplateDefinition,
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

      const siteConfiguration = await createCompanyOnboardingBundle(db, {
        apexDomain: plotkeysRootDomain,
        companyName,
        createdById: ctx.auth.session.user.id,
        dashboardHostname: buildDashboardHostname(subdomain),
        initialSiteConfiguration: createInitialSiteConfigurationInput({
          companyName,
          market,
          subdomain,
          templateKey,
        }),
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
      companyName: onboarding.companyName,
      completedAt: onboarding.completedAt,
      currentStep: onboarding.currentStep,
      market: onboarding.market,
      subdomain: onboarding.subdomain,
      templateKey: onboarding.templateKey,
    };
  }),
  saveOnboardingProgress: authenticatedProcedure
    .input(saveOnboardingProgressInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const existing = await findTenantOnboardingByUserId(
        db,
        ctx.auth.session.user.id,
      );

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No onboarding record found. Complete sign-up before saving progress.",
        });
      }

      await upsertTenantOnboarding(db, {
        companyName: existing.companyName,
        currentStep: input.currentStep ?? existing.currentStep,
        market: input.market ?? existing.market ?? undefined,
        subdomain: existing.subdomain,
        templateKey: input.templateKey ?? existing.templateKey ?? undefined,
        userId: ctx.auth.session.user.id,
      });

      return { saved: true };
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

      assertTemplateAccess(company.planTier, input.templateKey);

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

      const suggestion =
        input.contentKey === "hero.title"
          ? `${company.name} unlocks better moves.`
          : `${input.shortDetail} for ${company.name}.`;

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
});
