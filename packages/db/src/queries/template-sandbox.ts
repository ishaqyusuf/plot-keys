import { randomBytes } from "node:crypto";
import type { Db } from "../prisma";

export type TemplateSandboxPlanTier = "starter" | "plus" | "pro";

export type TemplateSandboxJson = Record<string, unknown>;

export type TemplateSandboxProfileRecord = {
  archivedAt: Date | null;
  companyName: string;
  contentJson: TemplateSandboxJson;
  createdAt: Date;
  id: string;
  market: string | null;
  name: string;
  ownerUserId: string;
  planTier: TemplateSandboxPlanTier;
  profileJson: TemplateSandboxJson;
  sampleDataJson: TemplateSandboxJson;
  shareId: string;
  subdomainLabel: string | null;
  templateKey: string;
  themeJson: TemplateSandboxJson;
  updatedAt: Date;
};

export type CreateTemplateSandboxProfileInput = {
  companyName: string;
  contentJson: TemplateSandboxJson;
  market?: string | null;
  name: string;
  ownerUserId: string;
  planTier: TemplateSandboxPlanTier;
  profileJson?: TemplateSandboxJson;
  sampleDataJson?: TemplateSandboxJson;
  subdomainLabel?: string | null;
  templateKey: string;
  themeJson: TemplateSandboxJson;
};

export type UpdateTemplateSandboxProfileInput = {
  companyName?: string;
  contentJson?: TemplateSandboxJson;
  market?: string | null;
  name?: string;
  ownerUserId: string;
  planTier?: TemplateSandboxPlanTier;
  profileJson?: TemplateSandboxJson;
  profileId: string;
  sampleDataJson?: TemplateSandboxJson;
  subdomainLabel?: string | null;
  templateKey?: string;
  themeJson?: TemplateSandboxJson;
};

function createShareId() {
  return randomBytes(9).toString("base64url");
}

async function findProfileIdByShareId(db: Db, shareId: string) {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT id::text AS id
    FROM template_sandbox_profiles
    WHERE share_id = ${shareId}
    LIMIT 1
  `;
  return rows[0]?.id ?? null;
}

async function createUniqueShareId(db: Db) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shareId = createShareId();
    const existingId = await findProfileIdByShareId(db, shareId);
    if (!existingId) return shareId;
  }

  return `${Date.now().toString(36)}${createShareId()}`;
}

function normalizeProfileRow(
  row: TemplateSandboxProfileRecord,
): TemplateSandboxProfileRecord {
  return {
    ...row,
    contentJson: row.contentJson ?? {},
    profileJson: row.profileJson ?? {},
    sampleDataJson: row.sampleDataJson ?? {},
    themeJson: row.themeJson ?? {},
  };
}

export async function listTemplateSandboxProfiles(
  db: Db,
  ownerUserId: string,
  options: { includeArchived?: boolean } = {},
) {
  const rows = options.includeArchived
    ? await db.$queryRaw<TemplateSandboxProfileRecord[]>`
        SELECT
          id::text AS id,
          share_id AS "shareId",
          owner_user_id AS "ownerUserId",
          name,
          template_key AS "templateKey",
          plan_tier AS "planTier",
          company_name AS "companyName",
          market,
          subdomain_label AS "subdomainLabel",
          theme_json AS "themeJson",
          content_json AS "contentJson",
          sample_data_json AS "sampleDataJson",
          profile_json AS "profileJson",
          archived_at AS "archivedAt",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM template_sandbox_profiles
        WHERE owner_user_id = ${ownerUserId}
        ORDER BY updated_at DESC
      `
    : await db.$queryRaw<TemplateSandboxProfileRecord[]>`
        SELECT
          id::text AS id,
          share_id AS "shareId",
          owner_user_id AS "ownerUserId",
          name,
          template_key AS "templateKey",
          plan_tier AS "planTier",
          company_name AS "companyName",
          market,
          subdomain_label AS "subdomainLabel",
          theme_json AS "themeJson",
          content_json AS "contentJson",
          sample_data_json AS "sampleDataJson",
          profile_json AS "profileJson",
          archived_at AS "archivedAt",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM template_sandbox_profiles
        WHERE owner_user_id = ${ownerUserId}
          AND archived_at IS NULL
        ORDER BY updated_at DESC
      `;

  return rows.map(normalizeProfileRow);
}

export async function getTemplateSandboxProfileForOwner(
  db: Db,
  input: { ownerUserId: string; profileId: string },
) {
  const rows = await db.$queryRaw<TemplateSandboxProfileRecord[]>`
    SELECT
      id::text AS id,
      share_id AS "shareId",
      owner_user_id AS "ownerUserId",
      name,
      template_key AS "templateKey",
      plan_tier AS "planTier",
      company_name AS "companyName",
      market,
      subdomain_label AS "subdomainLabel",
      theme_json AS "themeJson",
      content_json AS "contentJson",
      sample_data_json AS "sampleDataJson",
      profile_json AS "profileJson",
      archived_at AS "archivedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM template_sandbox_profiles
    WHERE id = ${input.profileId}::uuid
      AND owner_user_id = ${input.ownerUserId}
      AND archived_at IS NULL
    LIMIT 1
  `;

  return rows[0] ? normalizeProfileRow(rows[0]) : null;
}

export async function getTemplateSandboxProfileByShareId(
  db: Db,
  shareId: string,
) {
  const rows = await db.$queryRaw<TemplateSandboxProfileRecord[]>`
    SELECT
      id::text AS id,
      share_id AS "shareId",
      owner_user_id AS "ownerUserId",
      name,
      template_key AS "templateKey",
      plan_tier AS "planTier",
      company_name AS "companyName",
      market,
      subdomain_label AS "subdomainLabel",
      theme_json AS "themeJson",
      content_json AS "contentJson",
      sample_data_json AS "sampleDataJson",
      profile_json AS "profileJson",
      archived_at AS "archivedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM template_sandbox_profiles
    WHERE share_id = ${shareId}
      AND archived_at IS NULL
    LIMIT 1
  `;

  return rows[0] ? normalizeProfileRow(rows[0]) : null;
}

export async function createTemplateSandboxProfile(
  db: Db,
  input: CreateTemplateSandboxProfileInput,
) {
  const shareId = await createUniqueShareId(db);
  const rows = await db.$queryRaw<TemplateSandboxProfileRecord[]>`
    INSERT INTO template_sandbox_profiles (
      share_id,
      owner_user_id,
      name,
      template_key,
      plan_tier,
      company_name,
      market,
      subdomain_label,
      theme_json,
      content_json,
      sample_data_json,
      profile_json
    )
    VALUES (
      ${shareId},
      ${input.ownerUserId},
      ${input.name},
      ${input.templateKey},
      ${input.planTier}::company_plan_tier,
      ${input.companyName},
      ${input.market ?? null},
      ${input.subdomainLabel ?? null},
      ${JSON.stringify(input.themeJson)}::jsonb,
      ${JSON.stringify(input.contentJson)}::jsonb,
      ${JSON.stringify(input.sampleDataJson ?? {})}::jsonb,
      ${JSON.stringify(input.profileJson ?? {})}::jsonb
    )
    RETURNING
      id::text AS id,
      share_id AS "shareId",
      owner_user_id AS "ownerUserId",
      name,
      template_key AS "templateKey",
      plan_tier AS "planTier",
      company_name AS "companyName",
      market,
      subdomain_label AS "subdomainLabel",
      theme_json AS "themeJson",
      content_json AS "contentJson",
      sample_data_json AS "sampleDataJson",
      profile_json AS "profileJson",
      archived_at AS "archivedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return normalizeProfileRow(rows[0]!);
}

export async function updateTemplateSandboxProfile(
  db: Db,
  input: UpdateTemplateSandboxProfileInput,
) {
  const existing = await getTemplateSandboxProfileForOwner(db, {
    ownerUserId: input.ownerUserId,
    profileId: input.profileId,
  });

  if (!existing) return null;

  const next = {
    companyName: input.companyName ?? existing.companyName,
    contentJson: input.contentJson ?? existing.contentJson,
    market: input.market === undefined ? existing.market : input.market,
    name: input.name ?? existing.name,
    planTier: input.planTier ?? existing.planTier,
    profileJson: input.profileJson ?? existing.profileJson,
    sampleDataJson: input.sampleDataJson ?? existing.sampleDataJson,
    subdomainLabel:
      input.subdomainLabel === undefined
        ? existing.subdomainLabel
        : input.subdomainLabel,
    templateKey: input.templateKey ?? existing.templateKey,
    themeJson: input.themeJson ?? existing.themeJson,
  };

  const rows = await db.$queryRaw<TemplateSandboxProfileRecord[]>`
    UPDATE template_sandbox_profiles
    SET
      company_name = ${next.companyName},
      content_json = ${JSON.stringify(next.contentJson)}::jsonb,
      market = ${next.market},
      name = ${next.name},
      plan_tier = ${next.planTier}::company_plan_tier,
      profile_json = ${JSON.stringify(next.profileJson)}::jsonb,
      sample_data_json = ${JSON.stringify(next.sampleDataJson)}::jsonb,
      subdomain_label = ${next.subdomainLabel},
      template_key = ${next.templateKey},
      theme_json = ${JSON.stringify(next.themeJson)}::jsonb,
      updated_at = NOW()
    WHERE id = ${existing.id}::uuid
    RETURNING
      id::text AS id,
      share_id AS "shareId",
      owner_user_id AS "ownerUserId",
      name,
      template_key AS "templateKey",
      plan_tier AS "planTier",
      company_name AS "companyName",
      market,
      subdomain_label AS "subdomainLabel",
      theme_json AS "themeJson",
      content_json AS "contentJson",
      sample_data_json AS "sampleDataJson",
      profile_json AS "profileJson",
      archived_at AS "archivedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return rows[0] ? normalizeProfileRow(rows[0]) : null;
}

export async function archiveTemplateSandboxProfile(
  db: Db,
  input: { ownerUserId: string; profileId: string },
) {
  const existing = await getTemplateSandboxProfileForOwner(db, input);
  if (!existing) return null;

  const rows = await db.$queryRaw<TemplateSandboxProfileRecord[]>`
    UPDATE template_sandbox_profiles
    SET archived_at = NOW(), updated_at = NOW()
    WHERE id = ${existing.id}::uuid
    RETURNING
      id::text AS id,
      share_id AS "shareId",
      owner_user_id AS "ownerUserId",
      name,
      template_key AS "templateKey",
      plan_tier AS "planTier",
      company_name AS "companyName",
      market,
      subdomain_label AS "subdomainLabel",
      theme_json AS "themeJson",
      content_json AS "contentJson",
      sample_data_json AS "sampleDataJson",
      profile_json AS "profileJson",
      archived_at AS "archivedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return rows[0] ? normalizeProfileRow(rows[0]) : null;
}

export async function cloneTemplateSandboxProfile(
  db: Db,
  input: { ownerUserId: string; profileId: string },
) {
  const existing = await getTemplateSandboxProfileForOwner(db, input);
  if (!existing) return null;

  return createTemplateSandboxProfile(db, {
    companyName: existing.companyName,
    contentJson: existing.contentJson,
    market: existing.market,
    name: `${existing.name} Copy`,
    ownerUserId: input.ownerUserId,
    planTier: existing.planTier,
    profileJson: existing.profileJson,
    sampleDataJson: existing.sampleDataJson,
    subdomainLabel: existing.subdomainLabel,
    templateKey: existing.templateKey,
    themeJson: existing.themeJson,
  });
}
