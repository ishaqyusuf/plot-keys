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
  const session = await requireAuthenticatedSession();
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);

  const market = String(formData.get("market") ?? "").trim();
  const templateKey = String(formData.get("template") ?? "template-1");

  // Load persisted onboarding record from DB (durable across devices/sessions).
  // Fall back to the cookie for users who signed up before DB persistence was added.
  const prisma = createPrismaClient().db;
  const savedOnboarding = prisma
    ? await prisma.tenantOnboarding.findUnique({
        where: { userId: session.user.id },
      })
    : null;

  const companyName =
    savedOnboarding?.companyName ?? pendingOnboarding?.company ?? "";
  const subdomain = normalizeSubdomainLabel(
    savedOnboarding?.subdomain ?? pendingOnboarding?.subdomain ?? "",
  );

  try {
    if (!companyName || !subdomain) {
      throw new Error(
        "Your company setup details are missing. Please start again from signup.",
      );
    }

    // Persist the final market + template selection so the record is up-to-date
    // before the workspace procedure reads it.
    if (savedOnboarding && prisma) {
      await prisma.tenantOnboarding.update({
        data: {
          currentStep: "completing",
          market,
          templateKey,
        },
        where: { userId: session.user.id },
      });
    }

    const caller = await createServerCaller();
    const result = await caller.workspace.completeOnboarding({
      companyName,
      market,
      subdomain,
      templateKey,
    });

    clearPendingOnboardingCookie(cookieStore);
    redirect(`/builder?configId=${result.configId}&onboarded=1`);
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

export async function updateSiteThemeFieldAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const themeKey = String(formData.get("themeKey") ?? "");
  const value = String(formData.get("value") ?? "");

  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.updateSiteThemeField({
      configId,
      themeKey,
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
          : "Unable to update theme field.",
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

export async function saveOnboardingStepAction(formData: FormData) {
  const step = String(formData.get("currentStep") ?? "business-identity");
  const nextStep = String(formData.get("nextStep") ?? "");

  try {
    const caller = await createServerCaller();

    // biome-ignore lint/suspicious/noExplicitAny: dynamic input built per-step
    const input: Record<string, any> = {
      currentStep: nextStep || step,
    };

    if (step === "business-identity") {
      input.tagline =
        String(formData.get("tagline") ?? "").trim() || null;
      input.businessType =
        String(formData.get("businessType") ?? "").trim() || null;
      input.primaryGoal =
        String(formData.get("primaryGoal") ?? "").trim() || null;
    } else if (step === "market-focus") {
      const locationsRaw = String(formData.get("locations") ?? "");
      input.locations = locationsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const propertyTypeValues = formData.getAll("propertyTypes");
      input.propertyTypes = propertyTypeValues
        .map((v) => String(v).trim())
        .filter(Boolean);
      input.targetAudience =
        String(formData.get("targetAudience") ?? "").trim() || null;
    } else if (step === "brand-style") {
      input.tone = String(formData.get("tone") ?? "").trim() || null;
      input.stylePreference =
        String(formData.get("stylePreference") ?? "").trim() || null;
      input.preferredColorHint =
        String(formData.get("preferredColorHint") ?? "").trim() || null;
    } else if (step === "contact-operations") {
      input.phone = String(formData.get("phone") ?? "").trim() || null;
      input.contactEmail =
        String(formData.get("contactEmail") ?? "").trim() || null;
      input.whatsapp =
        String(formData.get("whatsapp") ?? "").trim() || null;
      input.officeAddress =
        String(formData.get("officeAddress") ?? "").trim() || null;
    } else if (step === "content-readiness") {
      input.hasLogo = formData.get("hasLogo") === "on";
      input.hasListings = formData.get("hasListings") === "on";
      input.hasExistingContent = formData.get("hasExistingContent") === "on";
      input.hasAgents = formData.get("hasAgents") === "on";
      input.hasProjects = formData.get("hasProjects") === "on";
      input.hasTestimonials = formData.get("hasTestimonials") === "on";
      input.hasBlogContent = formData.get("hasBlogContent") === "on";
    }

    await caller.workspace.saveOnboardingProgress(input);
    redirect(`/onboarding?step=${nextStep}`);
  } catch (error) {
    redirect(
      createRedirectUrl("/onboarding", {
        step,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save onboarding progress.",
      }),
    );
  }
}

// ---------------------------------------------------------------------------
// Property CRUD actions
// ---------------------------------------------------------------------------

export async function createPropertyAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const isUpdate = Boolean(propertyId);

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "active");
  const specs = String(formData.get("specs") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const bedroomsRaw = formData.get("bedrooms");
  const bathroomsRaw = formData.get("bathrooms");
  const bedrooms = bedroomsRaw ? Number(bedroomsRaw) : null;
  const bathrooms = bathroomsRaw ? Number(bathroomsRaw) : null;

  try {
    const caller = await createServerCaller();
    if (isUpdate) {
      await caller.workspace.updateProperty({
        bathrooms,
        bedrooms,
        imageUrl,
        location,
        price,
        propertyId,
        specs,
        status,
        title,
      });
    } else {
      await caller.workspace.createProperty({
        bathrooms,
        bedrooms,
        imageUrl,
        location,
        price,
        specs,
        status,
        title,
      });
    }
    revalidatePath("/properties");
    redirect("/properties");
  } catch (error) {
    redirect(
      `/properties?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to save property.",
      )}`,
    );
  }
}

export async function deletePropertyAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "").trim();

  try {
    const caller = await createServerCaller();
    await caller.workspace.deleteProperty({ propertyId });
    revalidatePath("/properties");
    redirect("/properties");
  } catch (error) {
    redirect(
      `/properties?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to delete property.",
      )}`,
    );
  }
}

export async function togglePropertyFeaturedAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const featured = formData.get("featured") === "true";

  try {
    const caller = await createServerCaller();
    await caller.workspace.togglePropertyFeatured({ featured, propertyId });
    revalidatePath("/properties");
    redirect("/properties");
  } catch (error) {
    redirect(
      `/properties?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to update property.",
      )}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Agent CRUD actions
// ---------------------------------------------------------------------------

export async function createAgentAction(formData: FormData) {
  const agentId = String(formData.get("agentId") ?? "").trim();
  const isUpdate = Boolean(agentId);

  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;

  try {
    const caller = await createServerCaller();
    if (isUpdate) {
      await caller.workspace.updateAgent({ agentId, bio, email, imageUrl, name, phone, title });
    } else {
      await caller.workspace.createAgent({ bio, email, imageUrl, name, phone, title });
    }
    revalidatePath("/agents");
    redirect("/agents");
  } catch (error) {
    redirect(
      `/agents?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to save agent.",
      )}`,
    );
  }
}

export async function deleteAgentAction(formData: FormData) {
  const agentId = String(formData.get("agentId") ?? "").trim();

  try {
    const caller = await createServerCaller();
    await caller.workspace.deleteAgent({ agentId });
    revalidatePath("/agents");
    redirect("/agents");
  } catch (error) {
    redirect(
      `/agents?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to delete agent.",
      )}`,
    );
  }
}

export async function refreshOnboardingAction() {
  try {
    const caller = await createServerCaller();
    await caller.workspace.refreshOnboardingProfile();
    revalidatePath("/onboarding");
    redirect("/onboarding?step=launch&refreshed=1");
  } catch (error) {
    redirect(
      `/onboarding?step=launch&error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unable to refresh recommendations.",
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
