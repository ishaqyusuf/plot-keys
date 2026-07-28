import type { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";
import { updateCompanyPlan } from "./company";
import { syncPlanIncludedLicenses } from "./template-license";

type BillingPlanTier = "starter" | "plus" | "pro";

export type ActivateSubscriptionPaymentInput = {
  allowedTemplateKeys: string[];
  amountMinorUnits: number;
  companyId: string;
  currency?: string | null;
  customerCode?: string | null;
  paidAt?: Date | null;
  planTier: BillingPlanTier;
  reference: string;
  subscriptionCode?: string | null;
};

export type ActivateCompanySubscriptionInput = {
  companyId: string;
};

export type CancelCompanySubscriptionInput = {
  companyId: string;
  eventId: string;
  starterTemplateKeys: string[];
  subscriptionCode?: string | null;
};

export type MarkCompanySubscriptionPastDueInput = {
  companyId: string;
};

export async function createBillingLineItem(
  db: Db,
  input: {
    amountMinorUnits: number;
    companyId: string;
    currency?: string;
    kind:
      | "ai_credits"
      | "domain_addon"
      | "stock_image"
      | "subscription"
      | "template_purchase";
    meta?: Prisma.InputJsonValue;
    paidAt?: Date | null;
    providerRef?: string | null;
    status?: "active" | "cancelled" | "expired" | "pending";
  },
) {
  return db.billingLineItem.create({
    data: {
      amountMinorUnits: input.amountMinorUnits,
      companyId: input.companyId,
      currency: input.currency ?? "NGN",
      kind: input.kind,
      meta: input.meta ?? {},
      paidAt: input.paidAt,
      providerRef: input.providerRef,
      status: input.status ?? "pending",
    },
  });
}

export async function upsertPaidSubscriptionBillingLineItem(
  db: Db,
  input: {
    amountMinorUnits: number;
    companyId: string;
    currency?: string | null;
    customerCode?: string | null;
    paidAt: Date;
    planTier: BillingPlanTier;
    reference: string;
    subscriptionCode?: string | null;
  },
) {
  const meta: Prisma.InputJsonObject = {
    planTier: input.planTier,
    reference: input.reference,
    ...(input.customerCode ? { customerCode: input.customerCode } : {}),
    ...(input.subscriptionCode
      ? { subscriptionCode: input.subscriptionCode }
      : {}),
  };
  const data = {
    amountMinorUnits: input.amountMinorUnits,
    currency: input.currency ?? "NGN",
    meta,
    paidAt: input.paidAt,
    status: "active" as const,
  };
  const updated = await db.billingLineItem.updateMany({
    data,
    where: {
      companyId: input.companyId,
      kind: "subscription",
      providerRef: input.reference,
    },
  });

  if (updated.count > 0) return updated;

  return db.billingLineItem.create({
    data: {
      ...data,
      companyId: input.companyId,
      kind: "subscription",
      providerRef: input.reference,
    },
  });
}

export async function activateSubscriptionPayment(
  db: Db,
  input: ActivateSubscriptionPaymentInput,
): Promise<void> {
  await updateCompanyPlan(db, input.companyId, input.planTier, "active");
  await syncPlanIncludedLicenses(
    db,
    input.companyId,
    input.allowedTemplateKeys,
  );
  await upsertPaidSubscriptionBillingLineItem(db, {
    amountMinorUnits: input.amountMinorUnits,
    companyId: input.companyId,
    currency: input.currency,
    customerCode: input.customerCode,
    paidAt: input.paidAt ?? new Date(),
    planTier: input.planTier,
    reference: input.reference,
    subscriptionCode: input.subscriptionCode,
  });
}

export async function activateCompanySubscription(
  db: Db,
  input: ActivateCompanySubscriptionInput,
): Promise<void> {
  await db.company
    .update({
      data: {
        planStatus: "active",
      },
      where: { id: input.companyId },
    })
    .catch(() => null);
}

export async function cancelCompanySubscription(
  db: Db,
  input: CancelCompanySubscriptionInput,
): Promise<void> {
  await updateCompanyPlan(db, input.companyId, "starter", "canceled");
  await syncPlanIncludedLicenses(
    db,
    input.companyId,
    input.starterTemplateKeys,
  );

  await createBillingLineItem(db, {
    amountMinorUnits: 0,
    companyId: input.companyId,
    currency: "NGN",
    kind: "subscription",
    meta: {
      event: "subscription.disable",
      ...(input.subscriptionCode
        ? { subscriptionCode: input.subscriptionCode }
        : {}),
    },
    providerRef: input.subscriptionCode ?? input.eventId,
    status: "cancelled",
  }).catch(() => null);
}

export async function markCompanySubscriptionPastDue(
  db: Db,
  input: MarkCompanySubscriptionPastDueInput,
): Promise<void> {
  await db.company
    .update({
      data: { planStatus: "past_due" },
      where: { id: input.companyId },
    })
    .catch(() => null);
}

export async function listBillingLineItemsForCompany(
  db: Db,
  input: {
    companyId: string;
    take?: number;
  },
) {
  return db.billingLineItem.findMany({
    orderBy: { createdAt: "desc" },
    take: input.take ?? 20,
    where: { companyId: input.companyId },
  });
}
