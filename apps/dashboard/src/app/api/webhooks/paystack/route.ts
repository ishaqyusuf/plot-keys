import {
  activateCompanySubscription,
  activateSubscriptionPayment,
  cancelCompanySubscription,
  markCompanySubscriptionPastDue,
} from "@plotkeys/db/queries";
import { canAccessTemplateTier, verifyWebhookSignature } from "@plotkeys/utils";
import { templateCatalog } from "@plotkeys/section-registry";
import { NextResponse } from "next/server";

/**
 * Paystack webhook handler.
 *
 * Paystack sends POST requests to this endpoint for payment events.
 * We verify the HMAC-SHA512 signature, then process subscription-related events.
 *
 * Supported events:
 * - charge.success — payment completed
 * - subscription.create — new subscription started
 * - subscription.disable — subscription cancelled
 * - invoice.payment_failed — recurring payment failed
 */

type PaystackEvent = {
  event: string;
  data: {
    id: number;
    reference?: string;
    subscription_code?: string;
    status: string;
    amount: number;
    currency: string;
    customer: { email: string; customer_code: string };
    metadata?: Record<string, unknown>;
    paid_at?: string;
    plan?: {
      plan_code: string;
      name: string;
      amount: number;
      interval: string;
    };
    next_payment_date?: string;
  };
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  // Verify webhook signature
  const isValid = await verifyWebhookSignature(body, signature);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as PaystackEvent;

  try {
    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(event.data);
        break;
      case "subscription.create":
        await handleSubscriptionCreate(event.data);
        break;
      case "subscription.disable":
        await handleSubscriptionDisable(event.data);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data);
        break;
      default:
        // Ignore unhandled events
        break;
    }
  } catch (error) {
    console.error(`[paystack-webhook] Error processing ${event.event}:`, error);
    // Return 200 to prevent Paystack from retrying — we log the error
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

async function handleChargeSuccess(data: PaystackEvent["data"]) {
  const companyId = data.metadata?.companyId as string | undefined;
  if (!companyId) return;

  const planTier = data.metadata?.planTier as
    | "starter"
    | "plus"
    | "pro"
    | undefined;
  if (!planTier) return;

  const allowedKeys = templateCatalog
    .filter((t) => canAccessTemplateTier(planTier, t.tier))
    .map((t) => t.key);
  await activateSubscriptionPayment({
    allowedTemplateKeys: allowedKeys,
    amountMinorUnits: data.amount,
    companyId,
    currency: data.currency,
    customerCode: data.customer?.customer_code,
    paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
    planTier,
    reference: data.reference ?? String(data.id),
    subscriptionCode: data.subscription_code,
  });
}

async function handleSubscriptionCreate(data: PaystackEvent["data"]) {
  const companyId = data.metadata?.companyId as string | undefined;
  if (!companyId) return;

  await activateCompanySubscription({ companyId });
}

async function handleSubscriptionDisable(data: PaystackEvent["data"]) {
  const companyId = data.metadata?.companyId as string | undefined;
  if (!companyId) return;

  // Revoke plan-included licenses (keep free + purchased)
  const starterKeys = templateCatalog
    .filter((t) => canAccessTemplateTier("starter", t.tier))
    .map((t) => t.key);
  await cancelCompanySubscription({
    companyId,
    eventId: String(data.id),
    starterTemplateKeys: starterKeys,
    subscriptionCode: data.subscription_code,
  });
}

async function handlePaymentFailed(data: PaystackEvent["data"]) {
  const companyId = data.metadata?.companyId as string | undefined;
  if (!companyId) return;

  await markCompanySubscriptionPastDue({ companyId });
}
