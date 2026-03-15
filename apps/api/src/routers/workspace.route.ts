import {
  createCompanyOnboardingBundle,
  createPrismaClient,
  createSiteConfiguration,
  type Db,
  findCompanyById,
  findCompanyBySlug,
  findLatestDraftForTemplate,
  findLatestSiteConfigurationForCompany,
  findSiteConfigurationByIdForCompany,
  listSyncableTenantDomains,
  markTenantDomainFailed,
  markTenantDomainProvisioning,
  publishSiteConfiguration,
  updateSiteConfigurationContentField,
  updateTenantDomainSyncResult,
} from "@plotkeys/db";
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
  syncTenantDomainWithVercel,
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

      await assertSubdomainAvailability(db, input.subdomain);
      assertTemplateAccess("starter", input.templateKey);

      const siteConfiguration = await createCompanyOnboardingBundle(db, {
        apexDomain: plotkeysRootDomain,
        companyName: input.companyName,
        createdById: ctx.auth.session.user.id,
        dashboardHostname: buildDashboardHostname(input.subdomain),
        initialSiteConfiguration: createInitialSiteConfigurationInput({
          companyName: input.companyName,
          market: input.market,
          subdomain: input.subdomain,
          templateKey: input.templateKey,
        }),
        market: input.market,
        sitefrontHostname: buildSitefrontHostname(input.subdomain),
        subdomain: input.subdomain,
      });

      return {
        configId: siteConfiguration.id,
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

    for (const domain of domains) {
      try {
        await markTenantDomainProvisioning(db, {
          domainId: domain.id,
        });

        const syncedDomain = await syncTenantDomainWithVercel(domain);

        await updateTenantDomainSyncResult(db, {
          domainId: domain.id,
          lastError: syncedDomain.lastError,
          provisionedAt: syncedDomain.provisionedAt ?? null,
          status: syncedDomain.status,
          vercelDomainName: syncedDomain.vercelDomainName ?? null,
          verificationJson: syncedDomain.verificationJson,
        });
      } catch (error) {
        await markTenantDomainFailed(db, {
          domainId: domain.id,
          message:
            error instanceof Error
              ? error.message
              : "Unable to sync tenant domain.",
        });
      }
    }

    return {
      syncedCount: domains.length,
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
});
