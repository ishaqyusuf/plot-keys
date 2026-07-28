import {
  activateSubscriptionPayment,
  findCompanyById,
  listBillingLineItemsForCompany,
} from "@plotkeys/db/queries";
import { templateCatalog } from "@plotkeys/section-registry";
import {
  buildDashboardUrl,
  canAccessTemplateTier,
  getPlanPricing,
  initializeTransaction,
  subscriptionTiers,
  verifyTransaction,
} from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import { initializeCheckoutInputSchema } from "../schemas/billing.schema";

const subscriptionTierSchema = z.enum(subscriptionTiers);

export const billingRouter = createTRPCRouter({
  confirmCheckout: membershipProcedure
    .input(z.object({ reference: z.string().trim().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await verifyTransaction(input.reference).catch(
        (error) => {
          console.error("[billing] Unable to verify payment:", error);
          return null;
        },
      );

      if (!transaction || transaction.status !== "success") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment could not be verified.",
        });
      }

      const companyId =
        typeof transaction.metadata?.companyId === "string"
          ? transaction.metadata.companyId
          : null;
      const parsedPlanTier = subscriptionTierSchema.safeParse(
        transaction.metadata?.planTier,
      );

      if (
        !companyId ||
        !parsedPlanTier.success ||
        companyId !== ctx.auth.activeMembership.companyId
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Payment does not belong to the active workspace.",
        });
      }

      const planTier = parsedPlanTier.data;
      const allowedTemplateKeys = templateCatalog
        .filter((template) => canAccessTemplateTier(planTier, template.tier))
        .map((template) => template.key);

      await activateSubscriptionPayment(ctx.db.db, {
        allowedTemplateKeys,
        amountMinorUnits: transaction.amount,
        companyId,
        currency: transaction.currency,
        customerCode: transaction.customer?.customer_code,
        paidAt: transaction.paid_at
          ? new Date(transaction.paid_at)
          : new Date(),
        planTier,
        reference: transaction.reference,
      });

      return { confirmed: true };
    }),

  getInfo: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    const companyId = ctx.auth.activeMembership.companyId;
    const company = await findCompanyById(db, companyId);

    if (!company) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found.",
      });
    }

    const recentItems = await listBillingLineItemsForCompany(db, {
      companyId,
      take: 20,
    });

    return {
      planEndsAt: company.planEndsAt,
      planStartedAt: company.planStartedAt,
      planStatus: company.planStatus,
      planTier: company.planTier,
      recentItems: recentItems.map((item) => ({
        amount: item.amountMinorUnits,
        createdAt: item.createdAt,
        currency: item.currency,
        id: item.id,
        kind: item.kind,
        paidAt: item.paidAt,
        providerRef: item.providerRef,
        status: item.status,
      })),
    };
  }),

  initializeCheckout: membershipProcedure
    .input(initializeCheckoutInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const db = ctx.db.db;
      const company = await findCompanyById(db, companyId);

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found.",
        });
      }

      const pricing = getPlanPricing(input.planTier);
      const price =
        input.interval === "monthly" ? pricing.monthly : pricing.annual;

      if (price.minorUnits === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot checkout for a free plan.",
        });
      }

      const callbackUrl =
        input.callbackUrl ?? buildDashboardUrl({ path: "/billing/callback" });
      const checkoutEmail =
        process.env.NODE_ENV === "development" && process.env.TEST_EMAIL
          ? process.env.TEST_EMAIL
          : (ctx.auth.session.user.email ?? "");

      if (!checkoutEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A billing email address is required to start checkout.",
        });
      }

      const transaction = await initializeTransaction({
        amount: price.minorUnits,
        callbackUrl,
        email: checkoutEmail,
        metadata: {
          companyId,
          interval: input.interval,
          planTier: input.planTier,
        },
      });

      await db.billingLineItem
        .create({
          data: {
            amountMinorUnits: price.minorUnits,
            companyId,
            currency: "NGN",
            kind: "subscription",
            meta: {
              interval: input.interval,
              planTier: input.planTier,
            },
            providerRef: transaction.reference,
            status: "pending",
          },
        })
        .catch(() => null);

      return {
        authorizationUrl: transaction.authorization_url,
        reference: transaction.reference,
      };
    }),
});
