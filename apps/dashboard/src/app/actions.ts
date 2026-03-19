"use server";

import { buildRequestContext } from "@plotkeys/api/context";
import { appRouter } from "@plotkeys/api/router";
import {
  authRoutes,
  authSessionCookieName,
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
  const { signedSessionToken, expiresAt } =
    await createBetterAuthSession(userId);

  cookieStore.set(authSessionCookieName, signedSessionToken, {
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

  let redirectUrl: string;
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

    redirectUrl = createRedirectUrl(authRoutes.signUpSuccess, {
      company,
      email: user.email,
      subdomain,
      token: verificationToken,
    });
  } catch (error) {
    redirectUrl = createRedirectUrl(authRoutes.signUp, {
      error:
        error instanceof Error ? error.message : "Unable to create account.",
    });
  }

  redirect(redirectUrl);
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  let redirectUrl: string;
  try {
    const user = await signInUser({
      email,
      password,
    });

    await setSessionCookie(user.id);
    redirectUrl = user.emailVerified
      ? authRoutes.dashboardHome
      : authRoutes.verifyEmail;
  } catch (error) {
    redirectUrl = createRedirectUrl(authRoutes.signIn, {
      error:
        error instanceof Error ? error.message : "Unable to sign in right now.",
    });
  }

  redirect(redirectUrl);
}

export async function verifyEmailAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");

  let redirectUrl: string;
  try {
    const user = await verifyUserEmail(token);

    await setSessionCookie(user.id);
    redirectUrl = resolvePostVerificationRoute("not_started");
  } catch (error) {
    redirectUrl = createRedirectUrl(authRoutes.verifyEmail, {
      error:
        error instanceof Error
          ? error.message
          : "Unable to verify that email address.",
    });
  }

  redirect(redirectUrl);
}

export async function signOutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(authSessionCookieName);
  clearPendingOnboardingCookie(cookieStore);
  redirect(authRoutes.signIn);
}

export async function completeOnboardingAction(formData: FormData) {
  const session = await requireAuthenticatedSession();
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);
  let redirectUrl: string;

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
    redirectUrl = `/builder?configId=${result.configId}`;
  } catch (error) {
    redirectUrl = createRedirectUrl(authRoutes.onboarding, {
      error:
        error instanceof Error ? error.message : "Unable to finish onboarding.",
    });
  }

  redirect(redirectUrl);
}

export async function createTemplateDraftAction(formData: FormData) {
  const templateKey = String(formData.get("templateKey") ?? "template-1");

  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.createTemplateDraft({
      templateKey,
    });

    redirectUrl = `/builder?configId=${result.configId}`;
  } catch (error) {
    redirectUrl = `/builder?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to create draft.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function updateSiteThemeFieldAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const themeKey = String(formData.get("themeKey") ?? "");
  const value = String(formData.get("value") ?? "");

  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.updateSiteThemeField({
      configId,
      themeKey,
      value,
    });

    revalidatePath("/builder");
    revalidatePath("/live");
    redirectUrl = `/builder?configId=${result.configId}&saved=1`;
  } catch (error) {
    redirectUrl = `/builder?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to update theme field.",
    )}`;
  }

  redirect(redirectUrl);
}

/**
 * Silent theme field update — revalidates the page without redirecting.
 * Used by the builder sidebar for optimistic UI so pickers don't trigger a full reload.
 */
export async function updateSiteThemeFieldSilentAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const themeKey = String(formData.get("themeKey") ?? "");
  const value = String(formData.get("value") ?? "");

  try {
    const caller = await createServerCaller();
    await caller.workspace.updateSiteThemeField({ configId, themeKey, value });
    revalidatePath("/builder");
    revalidatePath("/live");
  } catch {
    // Silently swallow — the optimistic local state already reflects the choice.
  }
}

export async function updateSiteFieldAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const contentKey = String(formData.get("contentKey") ?? "");
  const value = String(formData.get("value") ?? "");

  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.updateSiteField({
      configId,
      contentKey,
      value,
    });

    revalidatePath("/builder");
    revalidatePath("/live");
    redirectUrl = `/builder?configId=${result.configId}&saved=1`;
  } catch (error) {
    redirectUrl = `/builder?error=${encodeURIComponent(
      error instanceof Error
        ? error.message
        : "Unable to update template field.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function publishSiteConfigurationAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const nextName = String(formData.get("nextName") ?? "").trim();

  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.publishSiteConfiguration({
      configId,
      nextName,
    });

    revalidatePath("/");
    revalidatePath("/builder");
    revalidatePath("/live");
    redirectUrl = `/builder?configId=${result.configId}&published=1`;
  } catch (error) {
    redirectUrl = `/builder?error=${encodeURIComponent(
      error instanceof Error
        ? error.message
        : "Unable to publish template configuration.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function switchBuilderConfigurationAction(formData: FormData) {
  const configurationId = String(formData.get("configId") ?? "");

  redirect(`/builder?configId=${configurationId}`);
}

export async function smartFillFieldAction(formData: FormData) {
  const configId = String(formData.get("configId") ?? "");
  const contentKey = String(formData.get("contentKey") ?? "");
  const shortDetail = String(formData.get("shortDetail") ?? "");

  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    const result = await caller.workspace.smartFillField({
      configId,
      contentKey,
      shortDetail,
    });

    redirectUrl = `/builder?configId=${result.configId}&generated=1`;
  } catch (error) {
    redirectUrl = `/builder?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to smart-fill field.",
    )}`;
  }

  redirect(redirectUrl);
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
  } catch {}
}

export async function saveOnboardingStepAction(formData: FormData) {
  const step = String(formData.get("currentStep") ?? "business-identity");
  const nextStep = String(formData.get("nextStep") ?? "");

  let redirectUrl: string;
  try {
    const caller = await createServerCaller();

    // biome-ignore lint/suspicious/noExplicitAny: dynamic input built per-step
    const input: Record<string, any> = {
      currentStep: nextStep || step,
    };

    if (step === "business-identity") {
      input.tagline = String(formData.get("tagline") ?? "").trim() || null;
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
      input.targetAudience = formData
        .getAll("targetAudience")
        .map((v) => String(v).trim())
        .filter(Boolean);
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
      input.whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
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
    redirectUrl = `/onboarding?step=${nextStep}`;
  } catch (error) {
    redirectUrl = createRedirectUrl("/onboarding", {
      step,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save onboarding progress.",
    });
  }

  redirect(redirectUrl);
}

// ─── Property actions ─────────────────────────────────────────────────────

export async function createPropertyAction(formData: FormData) {
  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    await caller.workspace.createProperty({
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      price: String(formData.get("price") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      bedrooms: formData.get("bedrooms")
        ? Number(formData.get("bedrooms"))
        : null,
      bathrooms: formData.get("bathrooms")
        ? Number(formData.get("bathrooms"))
        : null,
      specs: String(formData.get("specs") ?? "").trim() || null,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
      status: String(formData.get("status") ?? "active") as
        | "active"
        | "sold"
        | "rented"
        | "off_market",
      featured: formData.get("featured") === "true",
    });
    revalidatePath("/properties");
    redirectUrl = "/properties";
  } catch (error) {
    redirectUrl = `/properties?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to create property.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function updatePropertyAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    await caller.workspace.updateProperty({
      propertyId,
      title: String(formData.get("title") ?? "").trim() || undefined,
      description: String(formData.get("description") ?? "").trim() || null,
      price: String(formData.get("price") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      bedrooms: formData.get("bedrooms")
        ? Number(formData.get("bedrooms"))
        : null,
      bathrooms: formData.get("bathrooms")
        ? Number(formData.get("bathrooms"))
        : null,
      specs: String(formData.get("specs") ?? "").trim() || null,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
      status: String(formData.get("status") ?? "active") as
        | "active"
        | "sold"
        | "rented"
        | "off_market",
      featured: formData.get("featured") === "true",
    });
    revalidatePath("/properties");
    redirectUrl = "/properties";
  } catch (error) {
    redirectUrl = `/properties?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to update property.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function deletePropertyAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    await caller.workspace.deleteProperty({ propertyId });
    revalidatePath("/properties");
    redirectUrl = "/properties";
  } catch (error) {
    redirectUrl = `/properties?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to delete property.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function togglePropertyFeaturedAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  try {
    const caller = await createServerCaller();
    await caller.workspace.togglePropertyFeatured({ propertyId });
    revalidatePath("/properties");
  } catch {
    // non-fatal — page will show current state on next load
  }
}

// ─── Agent actions ────────────────────────────────────────────────────────

export async function createAgentAction(formData: FormData) {
  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    await caller.workspace.createAgent({
      name: String(formData.get("name") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
      featured: formData.get("featured") === "true",
      displayOrder: formData.get("displayOrder")
        ? Number(formData.get("displayOrder"))
        : null,
    });
    revalidatePath("/agents");
    redirectUrl = "/agents";
  } catch (error) {
    redirectUrl = `/agents?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to create agent.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function updateAgentAction(formData: FormData) {
  const agentId = String(formData.get("agentId") ?? "");
  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    await caller.workspace.updateAgent({
      agentId,
      name: String(formData.get("name") ?? "").trim() || undefined,
      title: String(formData.get("title") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
      featured: formData.get("featured") === "true",
      displayOrder: formData.get("displayOrder")
        ? Number(formData.get("displayOrder"))
        : null,
    });
    revalidatePath("/agents");
    redirectUrl = "/agents";
  } catch (error) {
    redirectUrl = `/agents?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to update agent.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function deleteAgentAction(formData: FormData) {
  const agentId = String(formData.get("agentId") ?? "");
  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    await caller.workspace.deleteAgent({ agentId });
    revalidatePath("/agents");
    redirectUrl = "/agents";
  } catch (error) {
    redirectUrl = `/agents?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to delete agent.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function toggleAgentFeaturedAction(formData: FormData) {
  const agentId = String(formData.get("agentId") ?? "");
  try {
    const caller = await createServerCaller();
    await caller.workspace.toggleAgentFeatured({ agentId });
    revalidatePath("/agents");
  } catch {
    // non-fatal
  }
}

export async function syncTenantDomainsAction() {
  let redirectUrl = "/?domains=1";
  try {
    const caller = await createServerCaller();
    await caller.workspace.syncTenantDomains();

    revalidatePath("/");
    revalidatePath("/live");
  } catch {
    // non-fatal
  }
  redirect(redirectUrl);
}

// ─── Lead actions ─────────────────────────────────────────────────────────

export async function updateLeadStatusAction(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "new"
    | "contacted"
    | "qualified"
    | "closed";

  try {
    const caller = await createServerCaller();
    await caller.workspace.updateLeadStatus({ leadId, status });
    revalidatePath("/leads");
  } catch {
    // non-fatal
  }
}

// ─── Billing actions ──────────────────────────────────────────────────────

export async function initializeCheckoutAction(formData: FormData) {
  const planTier = String(formData.get("planTier") ?? "") as "plus" | "pro";
  const interval = String(formData.get("interval") ?? "monthly") as
    | "monthly"
    | "annual";

  const caller = await createServerCaller();
  const result = await caller.workspace.initializeCheckout({
    interval,
    planTier,
  });

  redirect(result.authorizationUrl);
}

// ─── Appointment actions ──────────────────────────────────────────────────

export async function createAppointmentAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "") || undefined;
  const scheduledAt = String(formData.get("scheduledAt") ?? "");
  const location = String(formData.get("location") ?? "") || undefined;
  const agentId = String(formData.get("agentId") ?? "") || undefined;
  const notes = String(formData.get("notes") ?? "") || undefined;

  const caller = await createServerCaller();
  await caller.workspace.createAppointment({
    agentId,
    email,
    location,
    name,
    notes,
    phone,
    scheduledAt: new Date(scheduledAt).toISOString(),
  });

  revalidatePath("/appointments");
  redirect("/appointments");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled";

  try {
    const caller = await createServerCaller();
    await caller.workspace.updateAppointmentStatus({ appointmentId, status });
    revalidatePath("/appointments");
  } catch {
    // non-fatal
  }
}

export async function deleteAppointmentAction(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") ?? "");

  try {
    const caller = await createServerCaller();
    await caller.workspace.deleteAppointment({ appointmentId });
    revalidatePath("/appointments");
  } catch {
    // non-fatal
  }
}

export async function purchaseAiCreditsAction() {
  "use server";

  try {
    const caller = await createServerCaller();
    await caller.workspace.purchaseAiCredits();
    revalidatePath("/ai-credits");
  } catch {
    // non-fatal
  }
}

// ─── Settings / Logo ──────────────────────────────────────────────────────

export async function setCompanyLogoAction(formData: FormData) {
  const logoUrl = formData.get("logoUrl");
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.workspace.setCompanyLogo({
      logoUrl: logoUrl ? String(logoUrl) : null,
    });
    revalidatePath("/settings");
    revalidatePath("/");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update logo.";
    errorRedirect = createRedirectUrl("/settings", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

// ─── Domain management ────────────────────────────────────────────────────

export async function syncDomainsAction() {
  let redirectUrl = "/domains?synced=1";
  try {
    const caller = await createServerCaller();
    await caller.workspace.syncTenantDomains();
    revalidatePath("/domains");
    revalidatePath("/");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Domain sync failed.";
    redirectUrl = createRedirectUrl("/domains", { error: message });
  }
  redirect(redirectUrl);
}

// ─── Team management ──────────────────────────────────────────────────────

export async function inviteMemberAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "staff") as "admin" | "agent" | "staff";
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.inviteMember({ email, role });
    revalidatePath("/team");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send invite.";
    errorRedirect = createRedirectUrl("/team", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  } else {
    redirect("/team?invited=1");
  }
}

export async function updateMemberRoleAction(formData: FormData) {
  const membershipId = String(formData.get("membershipId") ?? "");
  const role = String(formData.get("role") ?? "staff") as "admin" | "agent" | "staff";
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.updateMemberRole({ membershipId, role });
    revalidatePath("/team");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update role.";
    errorRedirect = createRedirectUrl("/team", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

export async function suspendMemberAction(formData: FormData) {
  const membershipId = String(formData.get("membershipId") ?? "");
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.suspendMember({ membershipId });
    revalidatePath("/team");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to suspend member.";
    errorRedirect = createRedirectUrl("/team", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

export async function reactivateMemberAction(formData: FormData) {
  const membershipId = String(formData.get("membershipId") ?? "");
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.reactivateMember({ membershipId });
    revalidatePath("/team");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reactivate member.";
    errorRedirect = createRedirectUrl("/team", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

export async function removeMemberAction(formData: FormData) {
  const membershipId = String(formData.get("membershipId") ?? "");
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.removeMember({ membershipId });
    revalidatePath("/team");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to remove member.";
    errorRedirect = createRedirectUrl("/team", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

export async function revokeInviteAction(formData: FormData) {
  const inviteId = String(formData.get("inviteId") ?? "");
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.revokeInvite({ inviteId });
    revalidatePath("/team");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to revoke invite.";
    errorRedirect = createRedirectUrl("/team", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

// ─── Property media + publish state ──────────────────────────────────────

export async function updatePropertyPublishStateAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  const publishState = String(formData.get("publishState") ?? "draft") as
    | "draft"
    | "published"
    | "archived";

  try {
    const caller = await createServerCaller();
    await caller.propertyMedia.updatePublishState({ propertyId, publishState });
    revalidatePath("/properties");
  } catch {
    // Silent — page reload will show current state
  }
}

export async function addPropertyMediaAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  const url = String(formData.get("url") ?? "");
  const kind = (String(formData.get("kind") ?? "image")) as
    | "image"
    | "floor_plan"
    | "virtual_tour";
  const isCover = formData.get("isCover") === "true";

  let errorRedirect: string | null = null;
  try {
    const caller = await createServerCaller();
    await caller.propertyMedia.addMedia({ propertyId, url, kind, isCover });
    revalidatePath("/properties");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add media.";
    errorRedirect = createRedirectUrl("/properties", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

export async function deletePropertyMediaAction(formData: FormData) {
  const mediaId = String(formData.get("mediaId") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");

  try {
    const caller = await createServerCaller();
    await caller.propertyMedia.deleteMedia({ mediaId, propertyId });
    revalidatePath("/properties");
  } catch {
    // Silent
  }
}

export async function setPropertyCoverAction(formData: FormData) {
  const mediaId = String(formData.get("mediaId") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");

  try {
    const caller = await createServerCaller();
    await caller.propertyMedia.setCover({ mediaId, propertyId });
    revalidatePath("/properties");
  } catch {
    // Silent
  }
}

// ─── Notifications ────────────────────────────────────────────────────────

export async function markAllNotificationsReadAction() {
  try {
    const caller = await createServerCaller();
    await caller.notifications.markAllRead();
    revalidatePath("/notifications");
  } catch {
    // Silent
  }
}


