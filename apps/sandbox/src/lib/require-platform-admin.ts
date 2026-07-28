import "server-only";

import { getAppSessionFromBetterAuth } from "@plotkeys/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

async function getSandboxSession() {
  const [cookieStore, requestHeaders] = await Promise.all([
    cookies(),
    headers(),
  ]);
  const forwardedHeaders = new Headers(requestHeaders);
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (cookieHeader) forwardedHeaders.set("cookie", cookieHeader);

  try {
    return await getAppSessionFromBetterAuth(forwardedHeaders);
  } catch {
    return null;
  }
}

export async function requirePlatformAdmin(redirectPath = "/") {
  const session = await getSandboxSession();
  if (!session) {
    redirect(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
  }

  if (session.activeMembership?.role !== "platform_admin") {
    redirect(
      `/sign-in?error=${encodeURIComponent(
        "Platform administrator access is required for the Sandbox.",
      )}`,
    );
  }

  return session as NonNullable<typeof session> & {
    activeMembership: NonNullable<
      NonNullable<typeof session>["activeMembership"]
    >;
  };
}
