import { activateSubscriptionPayment } from "@plotkeys/db/queries";
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

  const allowedKeys = templateCatalog
    .filter((template) => canAccessTemplateTier(planTier, template.tier))
    .map((template) => template.key);
  const paidAt = transaction.paid_at
    ? new Date(transaction.paid_at)
    : new Date();
  let activation: Awaited<ReturnType<typeof activateSubscriptionPayment>>;

  try {
    activation = await activateSubscriptionPayment({
      allowedTemplateKeys: allowedKeys,
      amountMinorUnits: transaction.amount,
      companyId,
      currency: transaction.currency,
      customerCode: transaction.customer?.customer_code,
      paidAt,
      planTier,
      reference: transaction.reference,
    });
  } catch (error) {
    console.error("[billing-callback] Unable to activate payment:", error);
    redirect("/billing?payment=activation-failed");
  }

  if (!activation.ok) {
    redirect(`/billing?payment=${activation.reason}`);
  }

  revalidatePath("/billing");
  revalidatePath("/app-store");
  revalidatePath("/", "layout");

  redirect("/billing?success=1");
}
