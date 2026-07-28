import "server-only";

import { buildRequestContext } from "@plotkeys/api/context";
import { appRouter } from "@plotkeys/api/router";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

import { requireOnboardedSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Billing Callback | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BillingCallbackPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const reference =
    firstSearchParam(params.reference) ?? firstSearchParam(params.trxref);

  if (!reference) {
    redirect("/billing");
  }

  const requestHeaders = new Headers(await headers());
  const caller = appRouter.createCaller(
    await buildRequestContext(requestHeaders),
  );
  const confirmed = await caller.billing
    .confirmCheckout({ reference })
    .then(() => true)
    .catch((error) => {
      console.error("[billing-callback] Unable to activate payment:", error);
      return false;
    });

  if (!confirmed) {
    redirect("/billing");
  }

  revalidatePath("/billing");
  revalidatePath("/app-store");
  revalidatePath("/", "layout");

  redirect("/billing");
}
