import {
  archiveTemplateSandboxProfile,
  cloneTemplateSandboxProfile,
  createPrismaClient,
  createTemplateSandboxProfile,
  getTemplateSandboxProfileForOwner,
  listTemplateSandboxProfiles,
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
} from "@plotkeys/section-registry";
import { TRPCError } from "@trpc/server";
import { authenticatedProcedure, createTRPCRouter } from "../lib.trpc";
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

function asStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      typeof item === "string" ? item : String(item ?? ""),
    ]),
  );
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

function serializeProfile(profile: Awaited<ReturnType<typeof createTemplateSandboxProfile>>) {
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
  archive: authenticatedProcedure
    .input(templateSandboxProfileIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const profile = await archiveTemplateSandboxProfile(db, {
        ownerUserId: ctx.auth.session.user.id,
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

  clone: authenticatedProcedure
    .input(templateSandboxProfileIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const profile = await cloneTemplateSandboxProfile(db, {
        ownerUserId: ctx.auth.session.user.id,
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

  create: authenticatedProcedure
    .input(createTemplateSandboxProfileInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
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
        ownerUserId: ctx.auth.session.user.id,
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

  get: authenticatedProcedure
    .input(templateSandboxProfileIdInputSchema)
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const profile = await getOwnedProfileOrThrow(db, {
        ownerUserId: ctx.auth.session.user.id,
        profileId: input.profileId,
      });

      return serializeProfile(profile);
    }),

  list: authenticatedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const profiles = await listTemplateSandboxProfiles(
      db,
      ctx.auth.session.user.id,
    );

    return profiles.map(serializeProfile);
  }),

  update: authenticatedProcedure
    .input(updateTemplateSandboxProfileInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await getOwnedProfileOrThrow(db, {
        ownerUserId: ctx.auth.session.user.id,
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
        ownerUserId: ctx.auth.session.user.id,
      });
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sandbox profile not found.",
        });
      }

      return serializeProfile(profile);
    }),

  updateContentField: authenticatedProcedure
    .input(updateTemplateSandboxContentFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const profile = await getOwnedProfileOrThrow(db, {
        ownerUserId: ctx.auth.session.user.id,
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
        ownerUserId: ctx.auth.session.user.id,
        profileId: profile.id,
      });

      return serializeProfile(updated ?? profile);
    }),

  updateThemeField: authenticatedProcedure
    .input(updateTemplateSandboxThemeFieldInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const profile = await getOwnedProfileOrThrow(db, {
        ownerUserId: ctx.auth.session.user.id,
        profileId: input.profileId,
      });
      const normalizedTheme = normalizeThemeFieldUpdateOrThrow({
        templateKey: profile.templateKey,
        theme: asStringRecord(profile.themeJson),
        themeKey: input.themeKey,
        value: input.value,
      });
      const updated = await updateTemplateSandboxProfile(db, {
        ownerUserId: ctx.auth.session.user.id,
        profileId: profile.id,
        themeJson: normalizedTheme,
      });

      return serializeProfile(updated ?? profile);
    }),
});
