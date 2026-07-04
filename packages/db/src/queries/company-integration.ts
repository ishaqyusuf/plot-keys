import type { Db } from "../prisma";

export type CompanyIntegrationInput = {
  calendlyUrl?: string | null;
  facebookPixelId?: string | null;
  googleAnalyticsId?: string | null;
  whatsappPhone?: string | null;
};

export async function getCompanyIntegration(db: Db, companyId: string) {
  return db.companyIntegration.findUnique({
    where: { companyId },
  });
}

export async function upsertCompanyIntegration(
  db: Db,
  companyId: string,
  input: CompanyIntegrationInput,
) {
  return db.companyIntegration.upsert({
    where: { companyId },
    create: {
      calendlyUrl: input.calendlyUrl ?? null,
      companyId,
      facebookPixelId: input.facebookPixelId ?? null,
      googleAnalyticsId: input.googleAnalyticsId ?? null,
      whatsappPhone: input.whatsappPhone ?? null,
    },
    update: {
      calendlyUrl: input.calendlyUrl ?? null,
      facebookPixelId: input.facebookPixelId ?? null,
      googleAnalyticsId: input.googleAnalyticsId ?? null,
      whatsappPhone: input.whatsappPhone ?? null,
    },
  });
}
