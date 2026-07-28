import {
  createBillingLineItem,
  getAiCreditBalance,
  getAiUsageStats,
  grantAiCredits,
} from "@plotkeys/db/queries";
import { aiCreditsBlockPrice } from "@plotkeys/utils";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const aiCreditsRouter = createTRPCRouter({
  get: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    const companyId = ctx.auth.activeMembership.companyId;
    const [balance, usage] = await Promise.all([
      getAiCreditBalance(db, companyId),
      getAiUsageStats(db, companyId),
    ]);

    return { balance, ...usage };
  }),

  purchase: membershipProcedure.mutation(async ({ ctx }) => {
    const db = ctx.db.db;
    const companyId = ctx.auth.activeMembership.companyId;
    const item = await createBillingLineItem(db, {
      amountMinorUnits: aiCreditsBlockPrice.minorUnits,
      companyId,
      kind: "ai_credits",
      meta: { credits: aiCreditsBlockPrice.creditsPerBlock },
      paidAt: new Date(),
      status: "active",
    });

    await grantAiCredits(db, {
      amount: aiCreditsBlockPrice.creditsPerBlock,
      companyId,
      description: `Top-up: ${aiCreditsBlockPrice.creditsPerBlock} credits`,
      reason: "top_up",
      referenceId: item.id,
    });

    return { credited: aiCreditsBlockPrice.creditsPerBlock };
  }),
});
