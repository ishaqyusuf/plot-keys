import type { Db } from "@plotkeys/db";
import {
  deductAiCredits,
  findCompanyById,
  findCompanyBySlug,
  findDraftVersionById,
  findLatestSiteConfigurationForCompany,
  findSiteConfigurationByIdForCompany,
  findTenantOnboardingByUserId,
  getBuilderWorkspaceData,
  getLivePreviewData,
  getOrCreateDraftVersion,
  hasEnoughCredits,
  hasTemplateLicense,
  listFeaturedProperties,
  logAiUsage,
  publishSiteConfiguration,
  publishWebsiteVersion,
  resolveActiveDraftForCompany,
  resolvePublishedForCompany,
  updateDraftVersion,
  updateSiteConfigurationContentField,
  updateSiteConfigurationThemeField,
  upsertDraftWebsiteVersion,
  upsertWebsite,
} from "@plotkeys/db/queries";
import {
  createCarriedForwardSiteConfigurationInput,
  createInitialSiteConfigurationInput,
  getTemplateAiContentField,
  getTemplateDefinition,
  getTemplateEditableFieldsForPage,
  getTemplateManifest,
  normalizeTemplateContentFieldUpdate,
  normalizeTemplateThemeFieldUpdate,
} from "@plotkeys/section-registry";
import {
  buildTenantSiteUrl,
  describeTemplateAccess,
  type SubscriptionTier,
} from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";
import {
  generateFieldContent,
  generateOnboardingContent,
  generatePageContent,
} from "../lib.ai";
import {
  createNotificationService,
  type NotificationUser,
} from "../lib.notification-service";
import {
  createTRPCRouter,
  membershipProcedure,
  publicProcedure,
} from "../lib.trpc";
import {
  createTemplateDraftInputSchema,
  generatePageContentInputSchema,
  getLivePreviewInputSchema,
  getSiteRenderDataInputSchema,
  publishSiteConfigurationInputSchema,
  smartFillFieldInputSchema,
  updateSiteFieldInputSchema,
  updateSiteThemeFieldInputSchema,
} from "../schemas/website.schema";

function queueSitePublishedNotification(input: {
  companyId: string;
  companyName: string;
  companySlug: string;
  configName: string;
  currentOrigin?: string | null;
  user: NotificationUser;
}) {
  void createNotificationService({
    companyId: input.companyId,
    user: input.user,
  })
    .send("site_published", {
      channels: ["email", "in_app"],
      payload: {
        companyName: input.companyName,
        configName: input.configName,
        fullName: input.user.name ?? input.user.email ?? "Workspace user",
        siteUrl: buildTenantSiteUrl(input.companySlug, {
          currentOrigin: input.currentOrigin,
        }),
      },
      sendEmail: true,
    })
    .catch(() => {
      // Notification dispatch is non-blocking for publish mutations.
    });
}

function queueSiteConfigurationSavedNotification(input: {
  companyId: string;
  description: string;
  user: NotificationUser;
}) {
  void createNotificationService({
    companyId: input.companyId,
    user: input.user,
  })
    .send("site_configuration_saved", {
      channels: ["in_app"],
      payload: { description: input.description },
    })
    .catch(() => {
      // Notification dispatch is non-blocking for builder save mutations.
    });
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

function normalizeContentFieldUpdateOrThrow(input: {
  content: Record<string, string>;
  contentKey: string;
  templateKey: string;
  value: string;
}) {
  try {
    return normalizeTemplateContentFieldUpdate(
      getTemplateManifest(input.templateKey),
      input.content,
      input.contentKey,
      input.value,
    );
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        error instanceof Error
          ? error.message
          : "Invalid template content field.",
    });
  }
}

function normalizeThemeFieldUpdateOrThrow(input: {
  templateKey: string;
  theme: Record<string, string>;
  themeKey: string;
  value: string;
}) {
  try {
    return normalizeTemplateThemeFieldUpdate(
      getTemplateManifest(input.templateKey),
      input.theme,
      input.themeKey,
      input.value,
    );
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        error instanceof Error
          ? error.message
          : "Invalid template theme field.",
    });
  }
}

export const websiteRouter = createTRPCRouter({
  activeDraft: membershipProcedure.query(async ({ ctx }) => {
    return resolveActiveDraftForCompany(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),
  builder: membershipProcedure.query(async ({ ctx }) => {
    return getBuilderWorkspaceData(ctx.db.db, {
      companyId: ctx.auth.activeMembership.companyId,
      userId: ctx.auth.session.user.id,
    });
  }),
  preview: membershipProcedure
    .input(getLivePreviewInputSchema)
    .query(async ({ ctx, input }) => {
      return getLivePreviewData(ctx.db.db, {
        ...input,
        companyId: ctx.auth.activeMembership.companyId,
      });
    }),
  /**
   * AI bootstrap: generates hero/intro/CTA copy from onboarding context,
   * updates the active draft WebsiteVersion, and deducts AI credits.
   */
  bootstrapAiContent: membershipProcedure.mutation(async ({ ctx }) => {
    const db = ctx.db.db;
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

  generatePageContent: membershipProcedure
    .input(generatePageContentInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;

      const company = await findCompanyById(db, companyId);
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found.",
        });
      }

      // Check credits
      const enough = await hasEnoughCredits(db, companyId, "page_content");
      if (!enough) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Insufficient AI credits. Page content generation costs 10 credits.",
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

      const manifest = getTemplateManifest(draft.templateKey);
      const targetFields = getTemplateEditableFieldsForPage(
        manifest,
        input.pageKey,
      )
        .filter((field) => field.aiEnabled)
        .map((field) => ({
          contentKey: field.contentKey,
          longDetail: field.longDetail,
          preferredLength: field.preferredLength,
          shortDetail: field.shortDetail || field.label,
        }));

      if (targetFields.length === 0) {
        return { fieldsUpdated: [] as string[], success: true };
      }

      // Fetch onboarding for business context (optional)
      const onboarding = await findTenantOnboardingByUserId(
        db,
        ctx.auth.session.user.id,
      );

      const generated = await generatePageContent({
        businessSummary: onboarding?.businessSummary,
        businessType: onboarding?.businessType,
        companyName: company.name,
        fields: targetFields,
        market: onboarding?.market ?? company.market,
        pageKey: input.pageKey,
        templateKey: draft.templateKey,
        tone: onboarding?.tone,
      });

      if (!generated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "AI content generation failed. Ensure ANTHROPIC_API_KEY is configured.",
        });
      }

      // Merge generated content into existing draft content
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

      // Deduct credits and log usage
      await deductAiCredits(db, {
        companyId,
        feature: "page_content",
      });

      await logAiUsage(db, {
        companyId,
        creditsUsed: 10,
        feature: "page_content",
        meta: {
          fieldsGenerated: Object.keys(generated),
          pageKey: input.pageKey,
        },
        userId: ctx.auth.session.user.id,
      }).catch(() => null);

      return {
        fieldsUpdated: Object.keys(generated),
        success: true,
      };
    }),

  createDraft: membershipProcedure
    .input(createTemplateDraftInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
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

      const existingDraft = await resolveActiveDraftForCompany(db, company.id);

      if (existingDraft?.templateKey === input.templateKey) {
        return {
          configId: existingDraft.id,
        };
      }

      const initialSiteConfiguration =
        createCarriedForwardSiteConfigurationInput({
          companyName: company.name,
          contentJson: existingDraft?.contentJson as
            | Record<string, string>
            | undefined,
          market: company.market ?? company.name,
          subdomain: company.slug,
          templateKey: input.templateKey,
          themeJson: existingDraft?.themeJson as
            | Record<string, string>
            | undefined,
        });

      const draftVersion = await upsertDraftWebsiteVersion(db, {
        ...initialSiteConfiguration,
        companyId: company.id,
        createdById: ctx.auth.session.user.id,
        updatedById: ctx.auth.session.user.id,
      });

      return {
        configId: draftVersion.id,
      };
    }),
  ensureConfiguration: membershipProcedure.mutation(async ({ ctx }) => {
    const db = ctx.db.db;
    const companyId = ctx.auth.activeMembership.companyId;

    const existingDraft = await resolveActiveDraftForCompany(db, companyId);
    if (existingDraft) {
      return { configId: existingDraft.id };
    }

    const company = await findCompanyById(db, companyId);
    if (!company) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found.",
      });
    }

    const publishedVersion = await resolvePublishedForCompany(db, company.id);

    if (publishedVersion) {
      const draftVersion = await getOrCreateDraftVersion(db, {
        contentJson: publishedVersion.contentJson,
        createdById: ctx.auth.session.user.id,
        themeJson: publishedVersion.themeJson,
        websiteId: publishedVersion.websiteId,
      });

      return {
        configId: draftVersion.id,
      };
    }

    const latestConfiguration = await findLatestSiteConfigurationForCompany(
      db,
      company.id,
    );

    if (latestConfiguration) {
      const draftVersion = await upsertDraftWebsiteVersion(db, {
        companyId: company.id,
        contentJson: latestConfiguration.contentJson as Record<string, string>,
        createdById: ctx.auth.session.user.id,
        name: latestConfiguration.name,
        subdomain: company.slug,
        templateKey: latestConfiguration.templateKey,
        themeJson: latestConfiguration.themeJson as Record<string, string>,
        updatedById: ctx.auth.session.user.id,
      });

      return {
        configId: draftVersion.id,
      };
    }

    const starterTemplate = getTemplateDefinition("template-1");
    const initialInput = createInitialSiteConfigurationInput({
      companyName: company.name,
      market: company.market ?? company.name,
      subdomain: company.slug,
      templateKey: starterTemplate.key,
    });

    const website = await upsertWebsite(db, {
      companyId,
      subdomain: company.slug,
      templateKey: starterTemplate.key,
    });

    const version = await getOrCreateDraftVersion(db, {
      contentJson: initialInput.contentJson,
      createdById: ctx.auth.session.user.id,
      themeJson: initialInput.themeJson,
      websiteId: website.id,
    });

    return { configId: version.id };
  }),
  publish: membershipProcedure
    .input(publishSiteConfigurationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;

      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId,
        configId: input.configId,
      });

      if (configuration) {
        await assertCompanyCanUseTemplate(
          db,
          companyId,
          configuration.templateKey,
        );
        await publishSiteConfiguration(db, {
          companyId,
          configId: configuration.id,
          currentName: configuration.name,
          nextName: input.nextName,
          updatedById: ctx.auth.session.user.id,
          version: configuration.version,
        });
        const company = await findCompanyById(db, companyId);
        if (company) {
          queueSitePublishedNotification({
            companyId,
            companyName: company.name,
            companySlug: company.slug,
            configName: input.nextName ?? configuration.name,
            currentOrigin: ctx.headers.get("origin"),
            user: ctx.auth.session.user,
          });
        }
        return { configId: configuration.id };
      }

      const version = await findDraftVersionById(db, {
        companyId,
        versionId: input.configId,
      });
      if (!version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Configuration not found.",
        });
      }
      await assertCompanyCanUseTemplate(
        db,
        companyId,
        version.website.templateKey,
      );
      await publishWebsiteVersion(db, {
        companyId,
        name: input.nextName,
        updatedById: ctx.auth.session.user.id,
        versionId: version.id,
        websiteId: version.website.id,
      });
      const company = await findCompanyById(db, companyId);
      if (company) {
        queueSitePublishedNotification({
          companyId,
          companyName: company.name,
          companySlug: company.slug,
          configName: input.nextName ?? version.name ?? "Website draft",
          currentOrigin: ctx.headers.get("origin"),
          user: ctx.auth.session.user,
        });
      }
      return { configId: version.id };
    }),
  smartFillField: membershipProcedure
    .input(smartFillFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;

      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId,
        configId: input.configId,
      });

      const version = configuration
        ? null
        : await findDraftVersionById(db, {
            companyId,
            versionId: input.configId,
          });

      if (!configuration && !version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Configuration not found.",
        });
      }

      const templateKey =
        configuration?.templateKey ?? version!.website.templateKey;
      await assertCompanyCanUseTemplate(db, companyId, templateKey);
      const currentContent = (configuration?.contentJson ??
        version!.contentJson) as Record<string, string>;
      const manifest = getTemplateManifest(templateKey);
      const aiField = getTemplateAiContentField(manifest, input.contentKey);

      if (!aiField) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Template "${templateKey}" does not allow AI generation for content key "${input.contentKey}".`,
        });
      }

      const company = await findCompanyById(db, companyId);
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
        contentKey: aiField.contentKey,
        longDetail: aiField.longDetail,
        market: onboarding?.market ?? company.market,
        preferredLength: aiField.preferredLength,
        shortDetail: aiField.shortDetail || aiField.label,
        templateKey,
      });

      // Deduct credits if AI was actually used
      if (aiSuggestion) {
        const deducted = await deductAiCredits(db, {
          companyId,
          feature: "smart_fill",
        });

        await logAiUsage(db, {
          companyId,
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
          : `${aiField.shortDetail || aiField.label} for ${company.name}.`);

      if (configuration) {
        const normalizedContent = normalizeContentFieldUpdateOrThrow({
          content: currentContent,
          contentKey: input.contentKey,
          templateKey,
          value: suggestion,
        });
        await updateSiteConfigurationContentField(db, {
          configId: configuration.id,
          contentKey: input.contentKey,
          currentContent,
          updatedById: ctx.auth.session.user.id,
          value: normalizedContent[input.contentKey] ?? suggestion,
          version: configuration.version,
        });
        queueSiteConfigurationSavedNotification({
          companyId,
          description: `AI updated ${aiField.label}.`,
          user: ctx.auth.session.user,
        });
        return { configId: configuration.id };
      }

      const newContent = normalizeContentFieldUpdateOrThrow({
        content: currentContent,
        contentKey: input.contentKey,
        templateKey,
        value: suggestion,
      });
      await updateDraftVersion(db, {
        contentJson: newContent,
        updatedById: ctx.auth.session.user.id,
        versionId: version!.id,
      });
      queueSiteConfigurationSavedNotification({
        companyId,
        description: `AI updated ${aiField.label}.`,
        user: ctx.auth.session.user,
      });
      return { configId: version!.id };
    }),
  updateContentField: membershipProcedure
    .input(updateSiteFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;

      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId,
        configId: input.configId,
      });

      if (configuration) {
        await assertCompanyCanUseTemplate(
          db,
          companyId,
          configuration.templateKey,
        );
        const normalizedContent = normalizeContentFieldUpdateOrThrow({
          content: configuration.contentJson as Record<string, string>,
          contentKey: input.contentKey,
          templateKey: configuration.templateKey,
          value: input.value,
        });
        await updateSiteConfigurationContentField(db, {
          configId: configuration.id,
          contentKey: input.contentKey,
          currentContent: configuration.contentJson as Record<string, string>,
          updatedById: ctx.auth.session.user.id,
          value: normalizedContent[input.contentKey] ?? input.value,
          version: configuration.version,
        });
        queueSiteConfigurationSavedNotification({
          companyId,
          description: `Saved builder content field ${input.contentKey}.`,
          user: ctx.auth.session.user,
        });
        return { configId: configuration.id };
      }

      const version = await findDraftVersionById(db, {
        companyId,
        versionId: input.configId,
      });
      if (!version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Configuration not found.",
        });
      }
      await assertCompanyCanUseTemplate(
        db,
        companyId,
        version.website.templateKey,
      );
      const newContent = normalizeContentFieldUpdateOrThrow({
        content: version.contentJson as Record<string, string>,
        contentKey: input.contentKey,
        templateKey: version.website.templateKey,
        value: input.value,
      });
      await updateDraftVersion(db, {
        contentJson: newContent,
        updatedById: ctx.auth.session.user.id,
        versionId: version.id,
      });
      queueSiteConfigurationSavedNotification({
        companyId,
        description: `Saved builder content field ${input.contentKey}.`,
        user: ctx.auth.session.user,
      });
      return { configId: version.id };
    }),
  updateThemeField: membershipProcedure
    .input(updateSiteThemeFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;

      const configuration = await findSiteConfigurationByIdForCompany(db, {
        companyId,
        configId: input.configId,
      });

      if (configuration) {
        await assertCompanyCanUseTemplate(
          db,
          companyId,
          configuration.templateKey,
        );
        const normalizedTheme = normalizeThemeFieldUpdateOrThrow({
          templateKey: configuration.templateKey,
          theme: configuration.themeJson as Record<string, string>,
          themeKey: input.themeKey,
          value: input.value,
        });
        await updateSiteConfigurationThemeField(db, {
          configId: configuration.id,
          currentTheme: configuration.themeJson as Record<string, string>,
          themeKey: input.themeKey,
          updatedById: ctx.auth.session.user.id,
          value: normalizedTheme[input.themeKey] ?? input.value,
          version: configuration.version,
        });
        queueSiteConfigurationSavedNotification({
          companyId,
          description: `Saved builder theme field ${input.themeKey}.`,
          user: ctx.auth.session.user,
        });
        return { configId: configuration.id };
      }

      const version = await findDraftVersionById(db, {
        companyId,
        versionId: input.configId,
      });
      if (!version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Configuration not found.",
        });
      }
      await assertCompanyCanUseTemplate(
        db,
        companyId,
        version.website.templateKey,
      );
      const newTheme = normalizeThemeFieldUpdateOrThrow({
        templateKey: version.website.templateKey,
        theme: version.themeJson as Record<string, string>,
        themeKey: input.themeKey,
        value: input.value,
      });
      await updateDraftVersion(db, {
        themeJson: newTheme,
        updatedById: ctx.auth.session.user.id,
        versionId: version.id,
      });
      queueSiteConfigurationSavedNotification({
        companyId,
        description: `Saved builder theme field ${input.themeKey}.`,
        user: ctx.auth.session.user,
      });
      return { configId: version.id };
    }),
  renderData: publicProcedure
    .input(getSiteRenderDataInputSchema)
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DATABASE_URL is not configured.",
        });
      }

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
});
