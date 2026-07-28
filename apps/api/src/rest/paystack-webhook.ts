import type { Db } from "@plotkeys/db";
import {
  activateCompanySubscription,
  activateSubscriptionPayment,
  cancelCompanySubscription,
  markCompanySubscriptionPastDue,
} from "@plotkeys/db/queries";
import { templateCatalog } from "@plotkeys/section-registry";
import {
  canAccessTemplateTier,
  subscriptionTiers,
  verifyWebhookSignature,
} from "@plotkeys/utils";
import { z } from "zod";

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

const subscriptionTierSchema = z.enum(subscriptionTiers);

export async function handlePaystackWebhook(request: Request, db: Db) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const isValid = await verifyWebhookSignature(body, signature);

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackEvent;

  try {
    event = JSON.parse(body) as PaystackEvent;
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(db, event.data);
        break;
      case "subscription.create":
        await handleSubscriptionCreate(db, event.data);
        break;
      case "subscription.disable":
        await handleSubscriptionDisable(db, event.data);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(db, event.data);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`[paystack-webhook] Error processing ${event.event}:`, error);
  }

  return Response.json({ received: true });
}

async function handleChargeSuccess(db: Db, data: PaystackEvent["data"]) {
  const companyId =
    typeof data.metadata?.companyId === "string"
      ? data.metadata.companyId
      : null;
  const parsedPlanTier = subscriptionTierSchema.safeParse(
    data.metadata?.planTier,
  );

  if (!companyId || !parsedPlanTier.success) return;

  const planTier = parsedPlanTier.data;
  const allowedTemplateKeys = templateCatalog
    .filter((template) => canAccessTemplateTier(planTier, template.tier))
    .map((template) => template.key);

  await activateSubscriptionPayment(db, {
    allowedTemplateKeys,
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

async function handleSubscriptionCreate(db: Db, data: PaystackEvent["data"]) {
  const companyId =
    typeof data.metadata?.companyId === "string"
      ? data.metadata.companyId
      : null;

  if (!companyId) return;

  await activateCompanySubscription(db, { companyId });
}

async function handleSubscriptionDisable(db: Db, data: PaystackEvent["data"]) {
  const companyId =
    typeof data.metadata?.companyId === "string"
      ? data.metadata.companyId
      : null;

  if (!companyId) return;

  const starterTemplateKeys = templateCatalog
    .filter((template) => canAccessTemplateTier("starter", template.tier))
    .map((template) => template.key);

  await cancelCompanySubscription(db, {
    companyId,
    eventId: String(data.id),
    starterTemplateKeys,
    subscriptionCode: data.subscription_code,
  });
}

async function handlePaymentFailed(db: Db, data: PaystackEvent["data"]) {
  const companyId =
    typeof data.metadata?.companyId === "string"
      ? data.metadata.companyId
      : null;

  if (!companyId) return;

  await markCompanySubscriptionPastDue(db, { companyId });
}
