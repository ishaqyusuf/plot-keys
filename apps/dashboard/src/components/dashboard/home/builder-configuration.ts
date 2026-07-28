import "server-only";

import { buildRequestContext } from "@plotkeys/api/context";
import { appRouter } from "@plotkeys/api/router";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

async function createDashboardHomeServerCaller() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const requestHeaders = new Headers(headerStore);
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  return appRouter.createCaller(await buildRequestContext(requestHeaders));
}

export async function ensureBuilderConfigurationExists() {
  try {
    const caller = await createDashboardHomeServerCaller();
    return await caller.website.ensureConfiguration();
  } catch {
    return null;
  }
}

export async function ensureDashboardHomeBuilderConfiguration() {
  let configId: string | undefined;
  let activeDraftId: string | undefined;

  try {
    const caller = await createDashboardHomeServerCaller();
    const result = await caller.website.ensureConfiguration();
    const activeDraft = await caller.website.activeDraft();
    configId = result.configId;
    activeDraftId = activeDraft?.id;
  } catch {
    return;
  }

  if (!activeDraftId && configId) {
    redirect(`/builder?configId=${configId}`);
  }
}
