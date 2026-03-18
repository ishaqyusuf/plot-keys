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
import { canAccessTemplateTier } from "@plotkeys/utils";

import { createPrismaClient } from "./prisma";
import { grantTemplateLicense } from "./queries/template-license";

const STARTER_KEYS = templateCatalog
  .filter((t) => t.tier === "starter")
  .map((t) => t.key);

const PLUS_KEYS = templateCatalog
  .filter((t) => t.tier === "plus" || t.tier === "starter")
  .map((t) => t.key);

const PRO_KEYS = templateCatalog.map((t) => t.key);

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
  const db = createPrismaClient();

  const companies = await db.company.findMany({
    select: { id: true, name: true, planTier: true },
    where: { deletedAt: null },
  });

  console.log(`Seeding template licenses for ${companies.length} companies...`);

  let granted = 0;
  let skipped = 0;

  for (const company of companies) {
    const keys = allowedKeysForTier(company.planTier);

    for (const templateKey of keys) {
      const existing = await db.tenantTemplateLicense.findFirst({
        where: { companyId: company.id, revokedAt: null, templateKey },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await grantTemplateLicense(db, {
        companyId: company.id,
        source: "plan_included",
        templateKey,
      });
      granted++;
      console.log(`  + Granted ${templateKey} (plan_included) → ${company.name}`);
    }

    // Every company gets at least one free starter pick
    const freeStarterKey = STARTER_KEYS[0];
    if (freeStarterKey) {
      const existingFree = await db.tenantTemplateLicense.findFirst({
        where: {
          companyId: company.id,
          revokedAt: null,
          source: "free",
          templateKey: freeStarterKey,
        },
      });

      if (!existingFree) {
        await grantTemplateLicense(db, {
          companyId: company.id,
          source: "free",
          templateKey: freeStarterKey,
        });
        granted++;
        console.log(`  + Granted ${freeStarterKey} (free) → ${company.name}`);
      }
    }
  }

  console.log(`\nDone. ${granted} licenses granted, ${skipped} already existed.`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
