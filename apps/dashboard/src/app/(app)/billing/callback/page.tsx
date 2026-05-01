import {
  createPrismaClient,
  syncPlanIncludedLicenses,
  updateCompanyPlan,
} from "@plotkeys/db";
import { templateCatalog } from "@plotkeys/section-registry";
import {
  canAccessTemplateTier,
  type SubscriptionTier,
  subscriptionTiers,
  verifyTransaction,
} from "@plotkeys/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Paystack redirects here after a successful payment.
 * Paystack appends ?trxref=xxx&reference=xxx to the callback URL.
 * Verify the transaction before activating the plan so checkout can recover
 * even when the webhook is delayed.
 */
type CallbackPageProps = {
  searchParams?: Promise<{ reference?: string; trxref?: string }>;
};

function isSubscriptionTier(value: string): value is SubscriptionTier {
  return subscriptionTiers.includes(value as SubscriptionTier);
}

export default async function BillingCallbackPage({
  searchParams,
}: CallbackPageProps) {
  const params = (await searchParams) ?? {};
  const reference = params.reference ?? params.trxref;

  if (!reference) {
    redirect("/billing?payment=missing-reference");
  }

  const transaction = await verifyTransaction(reference).catch((error) => {
    console.error("[billing-callback] Unable to verify payment:", error);
    return null;
  });

  if (!transaction) {
    redirect("/billing?payment=verification-failed");
  }

  if (transaction.status !== "success") {
    redirect("/billing?payment=not-successful");
  }

  const companyId =
    typeof transaction.metadata?.companyId === "string"
      ? transaction.metadata.companyId
      : null;
  const planTier =
    typeof transaction.metadata?.planTier === "string" &&
    isSubscriptionTier(transaction.metadata.planTier)
      ? transaction.metadata.planTier
      : null;

  if (!companyId || !planTier) {
    redirect("/billing?payment=missing-metadata");
  }

  const prisma = createPrismaClient().db;
  if (!prisma) {
    redirect("/billing?payment=database-unavailable");
  }

  try {
    await updateCompanyPlan(prisma, companyId, planTier, "active");

    const allowedKeys = templateCatalog
      .filter((template) => canAccessTemplateTier(planTier, template.tier))
      .map((template) => template.key);
    await syncPlanIncludedLicenses(prisma, companyId, allowedKeys);

    const paidAt = transaction.paid_at
      ? new Date(transaction.paid_at)
      : new Date();
    const updated = await prisma.billingLineItem.updateMany({
      data: {
        amountMinorUnits: transaction.amount,
        currency: transaction.currency ?? "NGN",
        meta: {
          customerCode: transaction.customer?.customer_code,
          planTier,
          reference: transaction.reference,
        },
        paidAt,
        status: "active",
      },
      where: {
        companyId,
        kind: "subscription",
        providerRef: transaction.reference,
      },
    });

    if (updated.count === 0) {
      await prisma.billingLineItem.create({
        data: {
          amountMinorUnits: transaction.amount,
          companyId,
          currency: transaction.currency ?? "NGN",
          kind: "subscription",
          meta: {
            customerCode: transaction.customer?.customer_code,
            planTier,
            reference: transaction.reference,
          },
          paidAt,
          providerRef: transaction.reference,
          status: "active",
        },
      });
    }

    revalidatePath("/billing");
    revalidatePath("/app-store");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[billing-callback] Unable to activate payment:", error);
    redirect("/billing?payment=activation-failed");
  }

  redirect("/billing?success=1");
}
