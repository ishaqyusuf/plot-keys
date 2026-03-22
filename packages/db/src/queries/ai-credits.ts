import type { Db } from "../client";

// ---------------------------------------------------------------------------
// Credit cost definitions
// ---------------------------------------------------------------------------

export const AI_CREDIT_COSTS: Record<string, number> = {
  blog_article: 25,
  full_website: 50,
  homepage_content: 20,
  lead_response: 3,
  project_customer_draft: 5,
  project_risk_flags: 5,
  project_summary: 10,
  property_description: 5,
  smart_fill: 2,
};

// ---------------------------------------------------------------------------
// Tier allowances (monthly credits granted per plan)
// ---------------------------------------------------------------------------

export const AI_TIER_ALLOWANCES: Record<string, number> = {
  plus: 0,
  pro: 200,
  starter: 0,
};

// ---------------------------------------------------------------------------
// Balance
// ---------------------------------------------------------------------------

/** Sum all credit ledger entries for a company to get current balance. */
export async function getAiCreditBalance(db: Db, companyId: string) {
  const result = await db.aiCreditLedger.aggregate({
    _sum: { amount: true },
    where: { companyId },
  });
  return result._sum.amount ?? 0;
}

/** Check if a company has enough credits for a feature. */
export async function hasEnoughCredits(
  db: Db,
  companyId: string,
  feature: string,
) {
  const cost = AI_CREDIT_COSTS[feature] ?? 1;
  const balance = await getAiCreditBalance(db, companyId);
  return balance >= cost;
}

// ---------------------------------------------------------------------------
// Ledger operations
// ---------------------------------------------------------------------------

/** Add credits to a company (plan allowance, top-up, promo). */
export async function grantAiCredits(
  db: Db,
  data: {
    amount: number;
    companyId: string;
    description?: string;
    reason: string;
    referenceId?: string;
  },
) {
  return db.aiCreditLedger.create({
    data: {
      amount: Math.abs(data.amount),
      companyId: data.companyId,
      description: data.description,
      reason: data.reason,
      referenceId: data.referenceId,
    },
  });
}

/** Deduct credits for an AI usage event. Returns false if insufficient. */
export async function deductAiCredits(
  db: Db,
  data: {
    companyId: string;
    feature: string;
    referenceId?: string;
  },
) {
  const cost = AI_CREDIT_COSTS[data.feature] ?? 1;
  const balance = await getAiCreditBalance(db, data.companyId);

  if (balance < cost) return false;

  await db.aiCreditLedger.create({
    data: {
      amount: -cost,
      companyId: data.companyId,
      description: `AI generation: ${data.feature}`,
      reason: "usage",
      referenceId: data.referenceId,
    },
  });

  return true;
}

// ---------------------------------------------------------------------------
// Usage logging
// ---------------------------------------------------------------------------

export async function logAiUsage(
  db: Db,
  data: {
    companyId: string;
    creditsUsed: number;
    feature: string;
    meta?: Record<string, unknown>;
    success?: boolean;
    tokensUsed?: number;
    userId: string;
  },
) {
  return db.aiUsageLog.create({
    data: {
      companyId: data.companyId,
      creditsUsed: data.creditsUsed,
      feature: data.feature,
      meta: data.meta ?? {},
      success: data.success ?? true,
      tokensUsed: data.tokensUsed,
      userId: data.userId,
    },
  });
}

export async function getAiUsageStats(db: Db, companyId: string) {
  const [totalUsed, byFeature, recentLogs] = await Promise.all([
    db.aiUsageLog.aggregate({
      _sum: { creditsUsed: true },
      where: { companyId, success: true },
    }),
    db.aiUsageLog.groupBy({
      by: ["feature"],
      _sum: { creditsUsed: true },
      _count: true,
      where: { companyId, success: true },
    }),
    db.aiUsageLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      where: { companyId },
    }),
  ]);

  return {
    byFeature: byFeature.map((f) => ({
      count: f._count,
      creditsUsed: f._sum.creditsUsed ?? 0,
      feature: f.feature,
    })),
    recentLogs,
    totalCreditsUsed: totalUsed._sum.creditsUsed ?? 0,
  };
}
