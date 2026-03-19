import {
  createPrismaClient,
  syncPlanIncludedLicenses,
  updateCompanyPlan,
} from "@plotkeys/db";
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

  const prisma = createPrismaClient().db;
  if (!prisma) return;

  // Update company plan to active
  await updateCompanyPlan(prisma, companyId, planTier, "active");

  // Sync template licenses
  const allowedKeys = templateCatalog
    .filter((t) => canAccessTemplateTier(planTier, t.tier))
    .map((t) => t.key);
  await syncPlanIncludedLicenses(prisma, companyId, allowedKeys);

  // Record billing line item
  await prisma.billingLineItem
    .create({
      data: {
        amountMinorUnits: data.amount,
        companyId,
        currency: data.currency ?? "NGN",
        kind: "subscription",
        meta: {
          customerCode: data.customer?.customer_code,
          planTier,
          subscriptionCode: data.subscription_code,
        },
        paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
        providerRef: data.reference ?? String(data.id),
        status: "active",
      },
    })
    .catch(() => null);
}

async function handleSubscriptionCreate(data: PaystackEvent["data"]) {
  const companyId = data.metadata?.companyId as string | undefined;
  if (!companyId) return;

  const prisma = createPrismaClient().db;
  if (!prisma) return;

  // Store subscription code for future management
  await prisma.company
    .update({
      data: {
        planStatus: "active",
      },
      where: { id: companyId },
    })
    .catch(() => null);
}

async function handleSubscriptionDisable(data: PaystackEvent["data"]) {
  const companyId = data.metadata?.companyId as string | undefined;
  if (!companyId) return;

  const prisma = createPrismaClient().db;
  if (!prisma) return;

  await updateCompanyPlan(prisma, companyId, "starter", "canceled");

  // Revoke plan-included licenses (keep free + purchased)
  const starterKeys = templateCatalog
    .filter((t) => canAccessTemplateTier("starter", t.tier))
    .map((t) => t.key);
  await syncPlanIncludedLicenses(prisma, companyId, starterKeys);

  await prisma.billingLineItem
    .create({
      data: {
        amountMinorUnits: 0,
        companyId,
        currency: "NGN",
        kind: "subscription",
        meta: {
          event: "subscription.disable",
          subscriptionCode: data.subscription_code,
        },
        providerRef: data.subscription_code ?? String(data.id),
        status: "cancelled",
      },
    })
    .catch(() => null);
}

async function handlePaymentFailed(data: PaystackEvent["data"]) {
  const companyId = data.metadata?.companyId as string | undefined;
  if (!companyId) return;

  const prisma = createPrismaClient().db;
  if (!prisma) return;

  // Mark plan as past_due — grace period applies
  await prisma.company
    .update({
      data: { planStatus: "past_due" },
      where: { id: companyId },
    })
    .catch(() => null);
}
