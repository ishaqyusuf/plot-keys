import {
  archiveTemplateSandboxProfile,
  cloneTemplateSandboxProfile,
  createPrismaClient,
  createTemplateSandboxProfile,
  getTemplateSandboxProfileForOwner,
  listTemplateSandboxProfiles,
  type TemplateSandboxProfileRecord,
  updateTemplateSandboxProfile,
  type Db,
} from "@plotkeys/db";
import {
  createInitialSiteConfigurationInput,
  getRegisterPlaceholderData,
  getTemplateDefinition,
  getTemplateManifest,
  normalizeTemplateContentFieldUpdate,
  normalizeTemplateThemeFieldUpdate,
  templateCatalog,
} from "@plotkeys/section-registry";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../lib.trpc";
import {
  createTemplateSandboxProfileInputSchema,
  templateSandboxProfileIdInputSchema,
  updateTemplateSandboxContentFieldInputSchema,
  updateTemplateSandboxProfileInputSchema,
  updateTemplateSandboxThemeFieldInputSchema,
} from "../schemas/template-sandbox.schema";

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

const publicTemplateSandboxOwnerId = "template-sandbox-public";

async function ensurePublicTemplateSandboxOwner(db: Db) {
  await db.$executeRaw`
    INSERT INTO users (
      id,
      email,
      email_verified,
      name,
      updated_at
    )
    VALUES (
      ${publicTemplateSandboxOwnerId},
      'template-sandbox@plotkeys.local',
      true,
      'Template Sandbox',
      NOW()
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

function asStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      typeof item === "string" ? item : String(item ?? ""),
    ]),
  );
}

function asObjectRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function resolveDefaultTemplateKey() {
  return (
    templateCatalog.find((template) => template.key === "riwaq-starter")?.key ??
    templateCatalog.find((template) => template.tier === "starter")?.key ??
    templateCatalog[0]?.key
  );
}

async function createDefaultSandboxProfile(db: Db) {
  const templateKey = resolveDefaultTemplateKey();
  if (!templateKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No registered templates are available for the sandbox.",
    });
  }

  const template = getTemplateDefinition(templateKey);
  const companyName = "Sandbox Estates";
  const market = "Lagos";
  const subdomainLabel = "sandbox-estates";
  const initial = createInitialSiteConfigurationInput({
    companyName,
    market,
    subdomain: subdomainLabel,
    templateKey: template.key,
  });
  const placeholderData = getRegisterPlaceholderData(template.key);

  return createTemplateSandboxProfile(db, {
    companyName,
    contentJson: initial.contentJson,
    market,
    name: `${template.name} Sandbox`,
    ownerUserId: publicTemplateSandboxOwnerId,
    planTier: "starter",
    profileJson: {
      defaultProfile: true,
    },
    sampleDataJson: placeholderData as unknown as Record<string, unknown>,
    subdomainLabel,
    templateKey: template.key,
    themeJson: initial.themeJson,
  });
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
        error instanceof Error ? error.message : "Invalid template theme field.",
    });
  }
}

async function upgradeLegacyRiwaqDefaultProfile(
  db: Db,
  profile: TemplateSandboxProfileRecord,
) {
  const profileJson = asObjectRecord(profile.profileJson);
  const contentJson = asStringRecord(profile.contentJson);
  const themeJson = asStringRecord(profile.themeJson);
  const isRiwaqDefaultProfile =
    profile.templateKey === "riwaq-starter" &&
    profileJson.defaultProfile === true;
  const normalizedAccentColor = (themeJson.accentColor ?? "").toLowerCase();
  const normalizedChartColor = (themeJson.chartColor ?? "").toLowerCase();
  const hasLegacyBackgroundOverride =
    (themeJson.backgroundColor ?? "").toLowerCase() === "#ececec" ||
    (themeJson.backgroundColor ?? "").toLowerCase() === "#f8fafc";
  const isUntouchedTaupeOrangeDefault =
    isRiwaqDefaultProfile &&
    themeJson.colorSystem === "taupe" &&
    themeJson.accentColor === "orange" &&
    (!themeJson.chartColor || themeJson.chartColor === "orange") &&
    (!themeJson.backgroundColor || hasLegacyBackgroundOverride);
  const isUntouchedSlateBlueDefault =
    isRiwaqDefaultProfile &&
    (!themeJson.colorSystem || themeJson.colorSystem === "slate") &&
    (!themeJson.accentColor ||
      normalizedAccentColor === "#2563eb" ||
      normalizedAccentColor === "blue") &&
    (!themeJson.chartColor ||
      normalizedChartColor === "#2563eb" ||
      normalizedChartColor === "blue") &&
    (!themeJson.backgroundColor || hasLegacyBackgroundOverride);
  const shouldUpgradeLegacyDefault =
    isUntouchedTaupeOrangeDefault || isUntouchedSlateBlueDefault;
  const isLegacyDefaultContent =
    isRiwaqDefaultProfile &&
    contentJson["hero.eyebrow"] === "Built from proven delivery" &&
    contentJson["hero.title"] === "Find your next signature property in Lagos." &&
    contentJson["hero.ctaText"] === "Browse listings";
  const themeJsonPatch: Record<string, string> = {};
  const contentJsonPatch = shouldUpgradeLegacyDefault
    ? isLegacyDefaultContent
      ? getTemplateDefinition(profile.templateKey).defaultContent
      : {
          ...getTemplateDefinition(profile.templateKey).defaultContent,
          ...contentJson,
        }
    : undefined;

  if (shouldUpgradeLegacyDefault) {
    themeJsonPatch.accentColor = "#522C1F";
    themeJsonPatch.chartColor = "#907762";
    themeJsonPatch.colorSystem = "rubbait";
    themeJsonPatch.fontFamily = "Raleway";
    themeJsonPatch.headingFontFamily = "Raleway";
  }

  if (isRiwaqDefaultProfile && hasLegacyBackgroundOverride) {
    themeJsonPatch.backgroundColor = "";
  }

  if (Object.keys(themeJsonPatch).length === 0 && !contentJsonPatch) {
    return profile;
  }

  const updated = await updateTemplateSandboxProfile(db, {
    contentJson: contentJsonPatch,
    ownerUserId: publicTemplateSandboxOwnerId,
    profileId: profile.id,
    themeJson:
      Object.keys(themeJsonPatch).length > 0
        ? {
            ...themeJson,
            ...themeJsonPatch,
          }
        : undefined,
  });

  return updated ?? profile;
}

function serializeProfile(
  profile: Awaited<ReturnType<typeof createTemplateSandboxProfile>>,
) {
  return {
    archivedAt: profile.archivedAt,
    companyName: profile.companyName,
    contentJson: profile.contentJson as Record<string, unknown>,
    createdAt: profile.createdAt,
    id: profile.id,
    market: profile.market,
    name: profile.name,
    planTier: profile.planTier,
    profileJson: profile.profileJson as Record<string, unknown>,
    sampleDataJson: profile.sampleDataJson as Record<string, unknown>,
    shareId: profile.shareId,
    subdomainLabel: profile.subdomainLabel,
    templateKey: profile.templateKey,
    themeJson: profile.themeJson as Record<string, unknown>,
    updatedAt: profile.updatedAt,
  };
}

async function getOwnedProfileOrThrow(
  db: Db,
  input: { ownerUserId: string; profileId: string },
) {
  const profile = await getTemplateSandboxProfileForOwner(db, input);
  if (!profile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Sandbox profile not found.",
    });
  }

  return profile;
}

export const templateSandboxRouter = createTRPCRouter({
  archive: publicProcedure
    .input(templateSandboxProfileIdInputSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const profile = await archiveTemplateSandboxProfile(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: input.profileId,
      });
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sandbox profile not found.",
        });
      }

      return { archived: true, profileId: profile.id };
    }),

  catalog: publicProcedure.query(() =>
    templateCatalog.map((template) => ({
      description: template.description,
      key: template.key,
      marketingTagline: template.marketingTagline,
      name: template.name,
      previewImageUrl: template.previewImageUrl ?? null,
      purchasable: template.purchasable,
      tier: template.tier,
      usageCount: 0,
    })),
  ),

  clone: publicProcedure
    .input(templateSandboxProfileIdInputSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      await ensurePublicTemplateSandboxOwner(db);
      const profile = await cloneTemplateSandboxProfile(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: input.profileId,
      });
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sandbox profile not found.",
        });
      }

      return serializeProfile(profile);
    }),

  create: publicProcedure
    .input(createTemplateSandboxProfileInputSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      await ensurePublicTemplateSandboxOwner(db);
      const template = getTemplateDefinition(input.templateKey);
      const market = input.market || input.companyName;
      const subdomainLabel =
        input.subdomainLabel ||
        input.companyName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        "sandbox";
      const initial = createInitialSiteConfigurationInput({
        companyName: input.companyName,
        market,
        subdomain: subdomainLabel,
        templateKey: template.key,
      });
      const placeholderData = getRegisterPlaceholderData(template.key);
      const profile = await createTemplateSandboxProfile(db, {
        companyName: input.companyName,
        contentJson: initial.contentJson,
        market,
        name: input.name || `${template.name} Sandbox`,
        ownerUserId: publicTemplateSandboxOwnerId,
        planTier: input.planTier,
        profileJson: input.profileJson ?? {},
        sampleDataJson:
          input.sampleDataJson ??
          (placeholderData as unknown as Record<string, unknown>),
        subdomainLabel,
        templateKey: template.key,
        themeJson: initial.themeJson,
      });

      return serializeProfile(profile);
    }),

  get: publicProcedure
    .input(templateSandboxProfileIdInputSchema)
    .query(async ({ input }) => {
      const db = getDb();
      const profile = await getOwnedProfileOrThrow(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: input.profileId,
      });

      return serializeProfile(
        await upgradeLegacyRiwaqDefaultProfile(db, profile),
      );
    }),

  generateLiveWebsite: publicProcedure
    .input(templateSandboxProfileIdInputSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const profile = await getOwnedProfileOrThrow(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: input.profileId,
      });
      const profileJson = asObjectRecord(profile.profileJson);
      const updated = await updateTemplateSandboxProfile(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: profile.id,
        profileJson: {
          ...profileJson,
          live: {
            companyName: profile.companyName,
            contentJson: profile.contentJson,
            generatedAt: new Date().toISOString(),
            market: profile.market,
            name: profile.name,
            planTier: profile.planTier,
            sampleDataJson: profile.sampleDataJson,
            subdomainLabel: profile.subdomainLabel,
            templateKey: profile.templateKey,
            themeJson: profile.themeJson,
            version: 1,
          },
        },
      });

      return serializeProfile(updated ?? profile);
    }),

  getOrCreateDefault: publicProcedure.query(async () => {
    const db = getDb();
    await ensurePublicTemplateSandboxOwner(db);
    const [latestProfile] = await listTemplateSandboxProfiles(
      db,
      publicTemplateSandboxOwnerId,
    );

    const profile = latestProfile ?? (await createDefaultSandboxProfile(db));

    return serializeProfile(
      await upgradeLegacyRiwaqDefaultProfile(db, profile),
    );
  }),

  list: publicProcedure.query(async () => {
    const db = getDb();
    const profiles = await listTemplateSandboxProfiles(
      db,
      publicTemplateSandboxOwnerId,
    );

    return profiles.map(serializeProfile);
  }),

  update: publicProcedure
    .input(updateTemplateSandboxProfileInputSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await getOwnedProfileOrThrow(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: input.profileId,
      });
      const nextTemplateKey = input.templateKey ?? existing.templateKey;
      const template = getTemplateDefinition(nextTemplateKey);
      const nextCompanyName = input.companyName ?? existing.companyName;
      const nextMarket = input.market ?? existing.market ?? nextCompanyName;
      const nextSubdomainLabel =
        input.subdomainLabel ?? existing.subdomainLabel ?? "sandbox";
      const templateChanged = nextTemplateKey !== existing.templateKey;
      const nextInitial = templateChanged
        ? createInitialSiteConfigurationInput({
            companyName: nextCompanyName,
            market: nextMarket,
            subdomain: nextSubdomainLabel,
            templateKey: template.key,
          })
        : null;
      const placeholderData = templateChanged
        ? getRegisterPlaceholderData(template.key)
        : null;

      const profile = await updateTemplateSandboxProfile(db, {
        ...input,
        ...(nextInitial
          ? {
              contentJson: nextInitial.contentJson,
              sampleDataJson: placeholderData as unknown as Record<
                string,
                unknown
              >,
              themeJson: nextInitial.themeJson,
            }
          : {}),
        ownerUserId: publicTemplateSandboxOwnerId,
      });
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sandbox profile not found.",
        });
      }

      return serializeProfile(profile);
    }),

  updateContentField: publicProcedure
    .input(updateTemplateSandboxContentFieldInputSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const profile = await getOwnedProfileOrThrow(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: input.profileId,
      });
      const normalizedContent = normalizeContentFieldUpdateOrThrow({
        content: asStringRecord(profile.contentJson),
        contentKey: input.contentKey,
        templateKey: profile.templateKey,
        value: input.value,
      });
      const updated = await updateTemplateSandboxProfile(db, {
        contentJson: normalizedContent,
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: profile.id,
      });

      return serializeProfile(updated ?? profile);
    }),

  updateThemeField: publicProcedure
    .input(updateTemplateSandboxThemeFieldInputSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const profile = await getOwnedProfileOrThrow(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: input.profileId,
      });
      const normalizedTheme = normalizeThemeFieldUpdateOrThrow({
        templateKey: profile.templateKey,
        theme: asStringRecord(profile.themeJson),
        themeKey: input.themeKey,
        value: input.value,
      });
      const updated = await updateTemplateSandboxProfile(db, {
        ownerUserId: publicTemplateSandboxOwnerId,
        profileId: profile.id,
        themeJson: normalizedTheme,
      });

      return serializeProfile(updated ?? profile);
    }),
});
