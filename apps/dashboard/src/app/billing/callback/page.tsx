import { redirect } from "next/navigation";

/**
 * Paystack redirects here after a successful payment.
 * Paystack appends ?trxref=xxx&reference=xxx to the callback URL.
 * We simply redirect to the billing page with a success indicator.
 */
type CallbackPageProps = {
  searchParams?: Promise<{ reference?: string; trxref?: string }>;
};

export default async function BillingCallbackPage({
  searchParams,
}: CallbackPageProps) {
  // Paystack sends ?reference=xxx after payment
  const params = (await searchParams) ?? {};
  const _reference = params.reference ?? params.trxref;

  // The actual plan activation happens via the Paystack webhook (charge.success)
  // which fires independently. We just redirect to billing with a success message.
  redirect("/billing?success=1");
}
