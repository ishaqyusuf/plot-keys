import {
  countCompaniesByTemplateKey,
  findCompanyById,
  findLicensedTemplateKeys,
  findTemplateLicensesForCompany,
  grantTemplateLicense,
  syncPlanIncludedLicenses,
} from "@plotkeys/db/queries";
import {
  getTemplateDefinition,
  templateCatalog,
} from "@plotkeys/section-registry";
import { canAccessTemplateTier } from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";

import {
  authenticatedProcedure,
  createTRPCRouter,
  membershipProcedure,
} from "../lib.trpc";
import { claimTemplateLicenseInputSchema } from "../schemas/templates.schema";

export const templatesRouter = createTRPCRouter({
  catalog: authenticatedProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Database is unavailable.",
      });
    }

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

  licenses: membershipProcedure.query(async ({ ctx }) => {
    const licenses = await findTemplateLicensesForCompany(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );

    return licenses.map((license) => ({
      grantedAt: license.grantedAt,
      source: license.source,
      templateKey: license.templateKey,
    }));
  }),

  claimFree: membershipProcedure
    .input(claimTemplateLicenseInputSchema)
    .mutation(async ({ ctx, input }) => {
      const template = getTemplateDefinition(input.templateKey);

      if (template.tier !== "starter") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Only starter-tier templates can be claimed as a free pick. Upgrade your plan to access higher-tier templates.",
        });
      }

      await grantTemplateLicense(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        grantedById: ctx.auth.session.user.id,
        source: "free",
        templateKey: input.templateKey,
      });

      return { granted: true, templateKey: input.templateKey };
    }),

  syncPlan: membershipProcedure.mutation(async ({ ctx }) => {
    const companyId = ctx.auth.activeMembership.companyId;
    const company = await findCompanyById(ctx.db.db, companyId);

    if (!company) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Company not found." });
    }

    const allowedKeys = templateCatalog
      .filter((template) =>
        canAccessTemplateTier(company.planTier, template.tier),
      )
      .map((template) => template.key);

    await syncPlanIncludedLicenses(ctx.db.db, companyId, allowedKeys);

    const licensedTemplateKeys = await findLicensedTemplateKeys(
      ctx.db.db,
      companyId,
    );

    return { licensedTemplateKeys: [...licensedTemplateKeys] };
  }),
});
