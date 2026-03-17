"use server";

import { buildRequestContext } from "@plotkeys/api/context";
import { appRouter } from "@plotkeys/api/router";
import {
  authCookiePrefix,
  authRoutes,
  createBetterAuthSession,
  resolvePostVerificationRoute,
  signInUser,
  signUpUser,
  verifyUserEmail,
} from "@plotkeys/auth";
import { createPrismaClient } from "@plotkeys/db";
import { normalizeSubdomainLabel } from "@plotkeys/utils";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  requireAuthenticatedSession,
  requireOnboardedSession,
} from "../lib/session";
import {
  clearPendingOnboardingCookie,
  readPendingOnboardingCookie,
} from "../lib/session-cookie";

const reservedSubdomains = new Set([
  "admin",
  "api",
  "app",
  "dashboard",
  "mail",
  "support",
  "www",
]);

function createRedirectUrl(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);

  return `${path}?${searchParams.toString()}`;
}

async function assertSubdomainAvailability(
  prisma: NonNullable<ReturnType<typeof createPrismaClient>["db"]>,
  subdomain: string,
) {
  if (!subdomain || subdomain.length < 3) {
    throw new Error("Choose a subdomain with at least 3 characters.");
  }

  if (reservedSubdomains.has(subdomain)) {
    throw new Error("That subdomain is reserved. Choose another one.");
  }

  const existingCompany = await prisma.company.findFirst({
    where: {
      deletedAt: null,
      slug: subdomain,
    },
  });

  if (existingCompany) {
    throw new Error("That subdomain is already in use.");
  }
}

async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  const { sessionToken, expiresAt } = await createBetterAuthSession(userId);

  cookieStore.set(`${authCookiePrefix}.session_token`, sessionToken, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

async function createServerCaller() {
  const headerStore = await headers();

  return appRouter.createCaller(await buildRequestContext(headerStore));
}

export async function signUpAction(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const phoneNumber = String(formData.get("phoneNumber") ?? "");
  const prisma = createPrismaClient().db;
  const subdomain = normalizeSubdomainLabel(
    String(formData.get("subdomain") ?? ""),
  );

  try {
    if (!prisma) {
      throw new Error("DATABASE_URL is not configured.");
    }

    await assertSubdomainAvailability(prisma, subdomain);

    const { user, verificationToken } = await signUpUser({
      email,
      emailVerified: false,
      name,
      password,
      phoneNumber,
    });

    redirect(
      createRedirectUrl(authRoutes.signUpSuccess, {
        company,
        email: user.email,
        subdomain,
        token: verificationToken,
      }),
    );
  } catch (error) {
    redirect(
      createRedirectUrl(authRoutes.signUp, {
        error:
          error instanceof Error ? error.message : "Unable to create account.",
      }),
    );
  }
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const user = await signInUser({
      email,
      password,
    });

    await setSessionCookie(user.id);
    const destination = user.emailVerified
      ? authRoutes.dashboardHome
      : authRoutes.verifyEmail;

    redirect(destination);
  } catch (error) {
    redirect(
      createRedirectUrl(authRoutes.signIn, {
        error:
          error instanceof Error
            ? error.message
            : "Unable to sign in right now.",
      }),
    );
  }
}

export async function verifyEmailAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");

  try {
    const user = await verifyUserEmail(token);

    await setSessionCookie(user.id);
    redirect(resolvePostVerificationRoute("not_started"));
  } catch (error) {
    redirect(
      createRedirectUrl(authRoutes.verifyEmail, {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify that email address.",
      }),
    );
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(`${authCookiePrefix}.session_token`);
  clearPendingOnboardingCookie(cookieStore);
  redirect(authRoutes.signIn);
}

export async function completeOnboardingAction(formData: FormData) {
  await requireAuthenticatedSession();
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);

  const companyName = pendingOnboarding?.company ?? "";
  const subdomain = normalizeSubdomainLabel(pendingOnboarding?.subdomain ?? "");
  const market = String(formData.get("market") ?? "").trim();
  const templateKey = String(formData.get("template") ?? "template-1");

  try {
    if (!companyName || !subdomain) {
      throw new Error(
        "Your company setup details are missing. Please start again from signup.",
      );
    }

    const caller = await createServerCaller();
    const result = await caller.workspace.completeOnboarding({
      companyName,
      market,
      subdomain,
      templateKey,
    });

    clearPendingOnboardingCookie(cookieStore);
    redirect(`/builder?configId=${result.configId}`);
  } catch (error) {
    redirect(
      createRedirectUrl(authRoutes.onboarding, {
        error:
          error instanceof Error
            ? error.message
            : "Unable to finish onboarding.",
      }),
    );
  }
}

export async function createTemplateDraftAction(formData: FormData) {
  const templateKey = String(formData.get("templateKey") ?? "template-1");

  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.createTemplateDraft({
      templateKey,
    });

    redirect(`/builder?configId=${result.configId}`);
  } catch (error) {
    redirect(
      `/builder?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to create draft.",
      )}`,
    );
  }
}

export async function updateSiteFieldAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const contentKey = String(formData.get("contentKey") ?? "");
  const value = String(formData.get("value") ?? "");

  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.updateSiteField({
      configId,
      contentKey,
      value,
    });

    revalidatePath("/builder");
    revalidatePath("/live");
    redirect(`/builder?configId=${result.configId}&saved=1`);
  } catch (error) {
    redirect(
      `/builder?error=${encodeURIComponent(
        error instanceof Error
          ? error.message
          : "Unable to update template field.",
      )}`,
    );
  }
}

export async function publishSiteConfigurationAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const nextName = String(formData.get("nextName") ?? "").trim();

  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.publishSiteConfiguration({
      configId,
      nextName,
    });

    revalidatePath("/");
    revalidatePath("/builder");
    revalidatePath("/live");
    redirect(`/builder?configId=${result.configId}&published=1`);
  } catch (error) {
    redirect(
      `/builder?error=${encodeURIComponent(
        error instanceof Error
          ? error.message
          : "Unable to publish template configuration.",
      )}`,
    );
  }
}

export async function switchBuilderConfigurationAction(formData: FormData) {
  const configurationId = String(formData.get("configId") ?? "");

  redirect(`/builder?configId=${configurationId}`);
}

export async function smartFillFieldAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const contentKey = String(formData.get("contentKey") ?? "");
  const shortDetail = String(formData.get("shortDetail") ?? "");
  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.smartFillField({
      configId,
      contentKey,
      shortDetail,
    });

    redirect(`/builder?configId=${result.configId}&generated=1`);
  } catch (error) {
    redirect(
      `/builder?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to smart-fill field.",
      )}`,
    );
  }
}

export async function ensureBuilderConfigurationExists() {
  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.ensureBuilderConfigurationExists();

    const session = await requireOnboardedSession();
    const prisma = createPrismaClient().db;

    if (!prisma) {
      redirect("/sign-in?error=DATABASE_URL is not configured.");
    }

    const configuration = await prisma.siteConfiguration.findFirst({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      where: {
        companyId: session.activeMembership.companyId,
        deletedAt: null,
      },
    });

    if (!configuration) {
      redirect(`/builder?configId=${result.configId}`);
    }
  } catch (error) {
    redirect(
      `/sign-in?error=${encodeURIComponent(
        error instanceof Error
          ? error.message
          : "Unable to ensure builder configuration.",
      )}`,
    );
  }
}

export async function syncTenantDomainsAction() {
  try {
    const caller = await createServerCaller();
    await caller.workspace.syncTenantDomains();

    revalidatePath("/");
    revalidatePath("/live");
    redirect("/?domains=1");
  } catch (error) {
    redirect(
      `/?error=${encodeURIComponent(
        error instanceof Error
          ? error.message
          : "Unable to sync tenant domains.",
      )}`,
    );
  }
}
