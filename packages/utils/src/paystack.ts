/**
 * Paystack API client — thin wrapper over the Paystack REST API.
 *
 * Covers the subset needed for PlotKeys billing:
 *   - Transaction initialization (redirect-based checkout)
 *   - Transaction verification
 *   - Subscription management (create plan, subscribe, cancel)
 *   - Webhook signature verification
 *
 * All amounts are in the smallest currency unit (kobo for NGN).
 * Paystack expects amounts in kobo already so we pass through directly.
 */

const PAYSTACK_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY environment variable is not set.");
  }
  return key;
}

async function paystackFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json = (await res.json()) as {
    data: T;
    message: string;
    status: boolean;
  };

  if (!res.ok || !json.status) {
    throw new Error(`Paystack API error: ${json.message ?? res.statusText}`);
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaystackTransactionInit = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type PaystackTransactionVerification = {
  id: number;
  status: "success" | "failed" | "abandoned";
  reference: string;
  amount: number;
  currency: string;
  customer: { email: string; customer_code: string };
  metadata?: Record<string, unknown>;
  paid_at?: string;
  channel?: string;
};

export type PaystackPlan = {
  id: number;
  plan_code: string;
  name: string;
  amount: number;
  interval: "monthly" | "annually" | "daily" | "weekly";
  currency: string;
};

export type PaystackSubscription = {
  id: number;
  subscription_code: string;
  status: string;
  plan: PaystackPlan;
  customer: { email: string; customer_code: string };
  next_payment_date: string;
  email_token: string;
};

// ---------------------------------------------------------------------------
// Transaction endpoints
// ---------------------------------------------------------------------------

/**
 * Initialize a Paystack transaction. Returns a checkout URL the user
 * should be redirected to for payment.
 */
export async function initializeTransaction(params: {
  /** Amount in kobo (minor units). */
  amount: number;
  email: string;
  /** URL Paystack redirects to after payment. */
  callbackUrl: string;
  /** Optional metadata attached to the transaction. */
  metadata?: Record<string, unknown>;
  /** Optional plan code for recurring subscriptions. */
  plan?: string;
  /** Optional idempotency reference. */
  reference?: string;
}): Promise<PaystackTransactionInit> {
  return paystackFetch<PaystackTransactionInit>("/transaction/initialize", {
    body: JSON.stringify({
      amount: params.amount,
      callback_url: params.callbackUrl,
      email: params.email,
      metadata: params.metadata,
      plan: params.plan,
      reference: params.reference,
    }),
    method: "POST",
  });
}

/** Verify a transaction by reference. */
export async function verifyTransaction(
  reference: string,
): Promise<PaystackTransactionVerification> {
  return paystackFetch<PaystackTransactionVerification>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}

// ---------------------------------------------------------------------------
// Plan endpoints
// ---------------------------------------------------------------------------

/** Create a Paystack plan (used once during setup). */
export async function createPlan(params: {
  name: string;
  amount: number;
  interval: "monthly" | "annually";
  currency?: string;
}): Promise<PaystackPlan> {
  return paystackFetch<PaystackPlan>("/plan", {
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency ?? "NGN",
      interval: params.interval,
      name: params.name,
    }),
    method: "POST",
  });
}

/** List all plans. */
export async function listPlans(): Promise<PaystackPlan[]> {
  return paystackFetch<PaystackPlan[]>("/plan");
}

// ---------------------------------------------------------------------------
// Subscription endpoints
// ---------------------------------------------------------------------------

/** Cancel a subscription. */
export async function cancelSubscription(params: {
  code: string;
  emailToken: string;
}): Promise<void> {
  await paystackFetch("/subscription/disable", {
    body: JSON.stringify({
      code: params.code,
      token: params.emailToken,
    }),
    method: "POST",
  });
}

/** Fetch a subscription by code. */
export async function getSubscription(
  code: string,
): Promise<PaystackSubscription> {
  return paystackFetch<PaystackSubscription>(
    `/subscription/${encodeURIComponent(code)}`,
  );
}

// ---------------------------------------------------------------------------
// Webhook verification
// ---------------------------------------------------------------------------

/**
 * Verify a Paystack webhook signature.
 *
 * Paystack signs webhooks with HMAC-SHA512 using your secret key.
 * The signature is sent in the `x-paystack-signature` header.
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string,
): Promise<boolean> {
  const key = getSecretKey();
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { hash: "SHA-512", name: "HMAC" },
    false,
    ["sign"],
  );

  const signed = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(body),
  );
  const hex = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex === signature;
}
