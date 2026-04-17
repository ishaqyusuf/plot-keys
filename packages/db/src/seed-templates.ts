/**
 * Platform template seeder.
 *
 * Ensures all tenants who should have plan-included licenses for the default
 * code-backed templates receive them. Run after a new template is added to
 * the catalog or after a batch of companies are created without proper seeding.
 *
 * Usage:
 *   bun packages/db/src/seed-templates.ts
 *   # or from the repo root:
 *   bun run --cwd packages/db seed:templates
 */

import { templateCatalog } from "@plotkeys/section-registry";

import { createPrismaClient } from "./prisma";
import { grantTemplateLicense } from "./queries/template-license";

const STARTER_KEYS = templateCatalog
  .filter((t: (typeof templateCatalog)[number]) => t.tier === "starter")
  .map((t: (typeof templateCatalog)[number]) => t.key);

const PLUS_KEYS = templateCatalog
  .filter(
    (t: (typeof templateCatalog)[number]) =>
      t.tier === "plus" || t.tier === "starter",
  )
  .map((t: (typeof templateCatalog)[number]) => t.key);

const PRO_KEYS = templateCatalog.map(
  (t: (typeof templateCatalog)[number]) => t.key,
);

function allowedKeysForTier(tier: string): string[] {
  switch (tier) {
    case "pro":
      return PRO_KEYS;
    case "plus":
      return PLUS_KEYS;
    default:
      return STARTER_KEYS;
  }
}

async function main() {
  const prisma = createPrismaClient().db;
  if (!prisma) {
    throw new Error("Database not configured.");
  }

  const companies = await prisma.company.findMany({
    select: { id: true, name: true, planTier: true },
    where: { deletedAt: null },
  });

  console.log(`Seeding template licenses for ${companies.length} companies...`);

  let granted = 0;
  let skipped = 0;

  for (const company of companies) {
    const keys = allowedKeysForTier(company.planTier);

    for (const templateKey of keys) {
      const existing = await prisma.tenantTemplateLicense.findFirst({
        where: { companyId: company.id, revokedAt: null, templateKey },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await grantTemplateLicense(prisma, {
        companyId: company.id,
        source: "plan_included",
        templateKey,
      });
      granted++;
      console.log(
        `  + Granted ${templateKey} (plan_included) → ${company.name}`,
      );
    }

    // Every company gets at least one free starter pick
    const freeStarterKey = STARTER_KEYS[0];
    if (freeStarterKey) {
      const existingFree = await prisma.tenantTemplateLicense.findFirst({
        where: {
          companyId: company.id,
          revokedAt: null,
          source: "free",
          templateKey: freeStarterKey,
        },
      });

      if (!existingFree) {
        await grantTemplateLicense(prisma, {
          companyId: company.id,
          source: "free",
          templateKey: freeStarterKey,
        });
        granted++;
        console.log(`  + Granted ${freeStarterKey} (free) → ${company.name}`);
      }
    }
  }

  console.log(
    `\nDone. ${granted} licenses granted, ${skipped} already existed.`,
  );
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
