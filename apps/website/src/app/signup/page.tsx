import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getDashboardUrl } from "../../lib/dashboard-url";

export default async function WebsiteSignUpPage() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const currentOrigin = host ? `${protocol}://${host}` : null;

  redirect(`${getDashboardUrl(currentOrigin)}/sign-up`);
}
