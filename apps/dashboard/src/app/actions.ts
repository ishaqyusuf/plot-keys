"use server";

import { buildRequestContext } from "@plotkeys/api/context";
import { createTenantAssetFromUpload } from "@plotkeys/api/asset-service";
import { appRouter } from "@plotkeys/api/router";
import {
  authRoutes,
  createBetterAuthSession,
  getScopedAuthSessionCookieName,
  platformSessionScope,
  resolvePostVerificationRoute,
  signInUser,
  signUpUser,
  verifyUserEmail,
} from "@plotkeys/auth";
import {
  acceptTeamInviteForUser,
  checkTenantSubdomainAvailability,
  completeTeamInviteProfile,
  createCompanyDepartment,
  createCompanyEmployee,
  createCompanyLeaveRequest,
  createCompanyPayrollEntry,
  deleteCompanyDepartment,
  deleteCompanyEmployee,
  getAgentReportCsv,
  getAppointmentExportRows,
  getBusinessSummaryCsv,
  getCustomerExportRows,
  getEmployeeExportRows,
  getLeadExportRows,
  getListingsReportCsv,
  getCompanyDisplayName,
  getActiveDraftForCompany,
  getPropertyExportRows,
  getUniqueEstateSlugForCompany,
  getTeamInviteProfileCompletionData,
  getTeamInviteSignupData,
  getTenantOnboardingForUser,
  installCompanyApp,
  markCompanyPayrollPaid,
  saveTenantOnboardingCompletionProgress,
  setCompanyLeaveRequestStatus,
  uninstallCompanyApp,
  updateCompanyDepartment,
  updateCompanyEmployee,
  type EmployeeEmploymentTypeValue,
  type EmployeeStatusValue,
  type LeaveTypeValue,
} from "@plotkeys/db/queries";
import {
  buildDashboardUrl,
  EMPLOYEE_WORK_ROLE_VALUES,
  isWorkRole,
  normalizeSubdomainLabel,
  resolveDashboardSessionScope,
  WORK_ROLE_LABELS,
  type WorkRole,
} from "@plotkeys/utils";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendWorkspaceInvitationNotification } from "@/lib/invite-notifications";
import {
  requireAuthenticatedSession,
  requireOnboardedSession,
} from "@/lib/session";
import {
  clearAuthSessionCookie,
  clearPendingOnboardingCookie,
  readPendingOnboardingCookie,
  setPendingOnboardingCookie,
} from "@/lib/session-cookie";
import { getTenantSignInUrlForSubdomain } from "@/lib/tenant-dashboard-url";

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

function parsePropertyPricingPlans(formData: FormData) {
  const raw = String(formData.get("paymentPlansJson") ?? "").trim();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function assertSubdomainAvailability(subdomain: string) {
  if (!subdomain || subdomain.length < 3) {
    throw new Error("Choose a subdomain with at least 3 characters.");
  }

  if (reservedSubdomains.has(subdomain)) {
    throw new Error("That subdomain is reserved. Choose another one.");
  }

  const availability = await checkTenantSubdomainAvailability(subdomain);

  if (!availability.ok && availability.reason === "database-unavailable") {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!availability.ok) {
    throw new Error("That subdomain is already in use.");
  }
}

async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const sessionScope =
    resolveDashboardSessionScope(host) ?? platformSessionScope;
  const { signedSessionToken, expiresAt } =
    await createBetterAuthSession(userId);

  cookieStore.set(
    getScopedAuthSessionCookieName(sessionScope),
    signedSessionToken,
    {
      expires: expiresAt,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

async function createServerCaller() {
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

function getDashboardAppUrl() {
  return buildDashboardUrl();
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  if (!host) {
    return getDashboardAppUrl();
  }

  return `${protocol}://${host}`;
}

function getInviteRoleLabel(role: "admin" | "agent" | "staff") {
  if (role === "agent") {
    return "an agent";
  }

  if (role === "staff") {
    return "an employee";
  }

  return "a team admin";
}

async function inviteWorkspaceUser(input: {
  email: string;
  redirectPath: string;
  role: "admin" | "agent" | "staff";
  successRedirect: string;
  workRole?: WorkRole | null;
}) {
  const session = await requireOnboardedSession();
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    const result = await caller.team.inviteMember({
      email: input.email,
      role: input.role,
      workRole: input.workRole,
    });

    const company = await getCompanyDisplayName(
      session.activeMembership.companyId,
    );

    await sendWorkspaceInvitationNotification({
      companyId: session.activeMembership.companyId,
      companyName: company.ok
        ? (company.name ?? "your company")
        : "your company",
      inviteUrl: new URL(result.inviteUrl, getDashboardAppUrl()).toString(),
      inviterId: session.user.id,
      inviterName: session.user.name ?? session.user.email,
      recipientEmail: input.email.trim().toLowerCase(),
      roleLabel:
        input.workRole && isWorkRole(input.workRole)
          ? WORK_ROLE_LABELS[input.workRole]
          : getInviteRoleLabel(input.role),
    });

    revalidatePath(input.redirectPath);
    revalidatePath("/team");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send invite.";
    errorRedirect = createRedirectUrl(input.redirectPath, { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }

  redirect(input.successRedirect);
}

export async function signUpAction(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const phoneNumber = String(formData.get("phoneNumber") ?? "");
  const subdomain = normalizeSubdomainLabel(
    String(formData.get("subdomain") ?? ""),
  );

  let redirectUrl: string;
  try {
    await assertSubdomainAvailability(subdomain);

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
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  clearAuthSessionCookie(cookieStore, host);
  clearPendingOnboardingCookie(cookieStore);
  redirect(authRoutes.signIn);
}

export async function completeOnboardingAction(formData: FormData) {
  const session = await requireAuthenticatedSession();
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);
  let redirectUrl: string;

  // Load persisted onboarding record from DB (durable across devices/sessions).
  // Fall back to the cookie for users who signed up before DB persistence was added.
  const savedOnboardingResult = await getTenantOnboardingForUser(
    session.user.id,
  );
  const savedOnboarding = savedOnboardingResult.ok
    ? savedOnboardingResult.onboarding
    : null;

  const companyName =
    savedOnboarding?.companyName ?? pendingOnboarding?.company ?? "";
  const subdomain = normalizeSubdomainLabel(
    savedOnboarding?.subdomain ?? pendingOnboarding?.subdomain ?? "",
  );
  const fallbackMarket =
    savedOnboarding?.locations?.find((value) => value.trim().length > 0) ?? "";
  const market =
    String(formData.get("market") ?? "").trim() ||
    savedOnboarding?.market ||
    fallbackMarket;
  const submittedTemplateKey = String(formData.get("templateKey") ?? "").trim();
  const templateKey = submittedTemplateKey || "template-1";

  try {
    if (!companyName || !subdomain) {
      throw new Error(
        "Your company setup details are missing. Please start again from signup.",
      );
    }
    if (!market) {
      throw new Error("Primary market is required before opening the builder.");
    }

    // Persist the final market + template selection so the record is up-to-date
    // before the workspace procedure reads it.
    if (savedOnboarding) {
      const progressResult = await saveTenantOnboardingCompletionProgress({
        hasAgents: formData.get("hasAgents") === "on",
        hasBlogContent: formData.get("hasBlogContent") === "on",
        hasExistingContent: formData.get("hasExistingContent") === "on",
        hasListings: formData.get("hasListings") === "on",
        hasLogo: formData.get("hasLogo") === "on",
        hasProjects: formData.get("hasProjects") === "on",
        hasTestimonials: formData.get("hasTestimonials") === "on",
        market,
        templateKey,
        userId: session.user.id,
      });

      if (!progressResult.ok) {
        throw new Error("DATABASE_URL is not configured.");
      }
    }

    const caller = await createServerCaller();
    const result = await caller.workspace.completeOnboarding({
      companyName,
      logoUrl: pendingOnboarding?.logoUrl ?? null,
      market,
      subdomain,
      templateKey,
    });

    clearPendingOnboardingCookie(cookieStore);
    redirectUrl = await getTenantSignInUrlForSubdomain(
      subdomain,
      `/builder?configId=${result.configId}&onboarding=1`,
    );
  } catch (error) {
    redirectUrl = createRedirectUrl(authRoutes.onboarding, {
      error:
        error instanceof Error ? error.message : "Unable to finish onboarding.",
    });
  }

  redirect(redirectUrl);
}

export async function setPendingOnboardingLogoAction(logoUrl: string | null) {
  "use server";

  const session = await requireAuthenticatedSession();
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);
  const savedOnboardingResult = await getTenantOnboardingForUser(
    session.user.id,
  );
  const savedOnboarding = savedOnboardingResult.ok
    ? savedOnboardingResult.onboarding
    : null;

  const company =
    pendingOnboarding?.company ?? savedOnboarding?.companyName ?? null;
  const subdomain =
    pendingOnboarding?.subdomain ?? savedOnboarding?.subdomain ?? null;

  if (!company || !subdomain) {
    return;
  }

  setPendingOnboardingCookie(cookieStore, {
    company,
    logoUrl,
    subdomain,
  });
  revalidatePath("/onboarding");
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

export async function createTemplateDraftSilentAction(formData: FormData) {
  const templateKey = String(formData.get("templateKey") ?? "template-1");
  const caller = await createServerCaller();
  const result = await caller.workspace.createTemplateDraft({
    templateKey,
  });

  revalidatePath("/builder");
  return result;
}

export async function createTemplateSandboxProfileAction(formData: FormData) {
  const caller = await createServerCaller();
  const result = await caller.templateSandbox.create({
    companyName: String(formData.get("companyName") ?? "Sandbox Homes"),
    market: String(formData.get("market") ?? "Lagos"),
    name: String(formData.get("name") ?? "").trim() || undefined,
    planTier:
      (String(formData.get("planTier") ?? "starter") as
        | "starter"
        | "plus"
        | "pro") ?? "starter",
    subdomainLabel: normalizeSubdomainLabel(
      String(formData.get("subdomainLabel") ?? "sandbox"),
    ),
    templateKey: String(formData.get("templateKey") ?? "riwaq-starter"),
  });

  revalidatePath("/template-sandbox");
  redirect(`/template-sandbox/${result.id}?created=1`);
}

export async function updateTemplateSandboxProfileAction(formData: FormData) {
  const profileId = String(formData.get("profileId") ?? "");
  const caller = await createServerCaller();
  await caller.templateSandbox.update({
    companyName: String(formData.get("companyName") ?? "").trim() || undefined,
    market: String(formData.get("market") ?? "").trim() || null,
    name: String(formData.get("name") ?? "").trim() || undefined,
    planTier:
      (String(formData.get("planTier") ?? "") as
        | "starter"
        | "plus"
        | "pro"
        | "") || undefined,
    profileId,
    subdomainLabel:
      normalizeSubdomainLabel(String(formData.get("subdomainLabel") ?? "")) ||
      null,
    templateKey: String(formData.get("templateKey") ?? "").trim() || undefined,
  });

  revalidatePath("/template-sandbox");
  revalidatePath(`/template-sandbox/${profileId}`);
}

export async function updateTemplateSandboxContentFieldAction(
  formData: FormData,
) {
  const profileId = String(
    formData.get("profileId") ?? formData.get("configId") ?? "",
  );
  const caller = await createServerCaller();
  await caller.templateSandbox.updateContentField({
    contentKey: String(formData.get("contentKey") ?? ""),
    profileId,
    value: String(formData.get("value") ?? ""),
  });

  revalidatePath(`/template-sandbox/${profileId}`);
}

export async function updateTemplateSandboxThemeFieldAction(
  formData: FormData,
) {
  const profileId = String(
    formData.get("profileId") ?? formData.get("configId") ?? "",
  );
  const caller = await createServerCaller();
  await caller.templateSandbox.updateThemeField({
    profileId,
    themeKey: String(formData.get("themeKey") ?? ""),
    value: String(formData.get("value") ?? ""),
  });

  revalidatePath(`/template-sandbox/${profileId}`);
}

export async function smartFillTemplateSandboxFieldAction(formData: FormData) {
  const profileId = String(
    formData.get("profileId") ?? formData.get("configId") ?? "",
  );
  const contentKey = String(formData.get("contentKey") ?? "");
  const label = String(formData.get("shortDetail") ?? contentKey)
    .replace(/\./g, " ")
    .trim();
  const caller = await createServerCaller();
  await caller.templateSandbox.updateContentField({
    contentKey,
    profileId,
    value: `Sandbox ${label || "content"} for rapid template testing.`,
  });

  revalidatePath(`/template-sandbox/${profileId}`);
}

export async function cloneTemplateSandboxProfileAction(formData: FormData) {
  const profileId = String(formData.get("profileId") ?? "");
  const caller = await createServerCaller();
  const result = await caller.templateSandbox.clone({ profileId });

  revalidatePath("/template-sandbox");
  redirect(`/template-sandbox/${result.id}?cloned=1`);
}

export async function archiveTemplateSandboxProfileAction(formData: FormData) {
  const profileId = String(formData.get("profileId") ?? "");
  const caller = await createServerCaller();
  await caller.templateSandbox.archive({ profileId });

  revalidatePath("/template-sandbox");
  redirect("/template-sandbox?archived=1");
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
    const draftResult = await getActiveDraftForCompany(
      session.activeMembership.companyId,
    );

    if (!draftResult.ok) {
      redirect("/sign-in?error=DATABASE_URL is not configured.");
    }

    if (!draftResult.activeDraft) {
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

export async function createProjectAction(formData: FormData) {
  let redirectUrl: string;
  try {
    const caller = await createServerCaller();
    await caller.projects.create({
      code: String(formData.get("code") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      name: String(formData.get("name") ?? "").trim(),
      startDate: String(formData.get("startDate") ?? "").trim() || null,
      targetCompletionDate:
        String(formData.get("targetCompletionDate") ?? "").trim() || null,
      type: (String(formData.get("type") ?? "").trim() || null) as
        | "building"
        | "estate"
        | "fit_out"
        | "infrastructure"
        | "renovation"
        | null,
    });
    revalidatePath("/projects");
    redirectUrl = "/projects";
  } catch (error) {
    redirectUrl = `/projects?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to create project.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function createPropertyAction(formData: FormData) {
  let redirectUrl: string;
  const returnTo = String(formData.get("returnTo") ?? "").trim();
  try {
    const paymentPlansJson = parsePropertyPricingPlans(formData);
    const caller = await createServerCaller();
    await caller.workspace.createProperty({
      estateId: String(formData.get("estateId") ?? "").trim() || null,
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
      type: (String(formData.get("type") ?? "").trim() || null) as
        | "residential"
        | "commercial"
        | "land"
        | "industrial"
        | "mixed_use"
        | null,
      subType: String(formData.get("subType") ?? "").trim() || null,
      quantityAvailable: formData.get("quantityAvailable")
        ? Number(formData.get("quantityAvailable"))
        : null,
      paymentPlanMonths: formData.get("paymentPlanMonths")
        ? Number(formData.get("paymentPlanMonths"))
        : null,
      paymentPlanAmount:
        String(formData.get("paymentPlanAmount") ?? "").trim() || null,
      paymentPlanInitialDepositPercent: formData.get(
        "paymentPlanInitialDepositPercent",
      )
        ? Number(formData.get("paymentPlanInitialDepositPercent"))
        : null,
      paymentPlanMonthlyAmount:
        String(formData.get("paymentPlanMonthlyAmount") ?? "").trim() || null,
      paymentPlansJson,
      status: String(formData.get("status") ?? "active") as
        | "active"
        | "sold"
        | "rented"
        | "off_market",
      featured: formData.get("featured") === "true",
    });
    revalidatePath("/properties");
    if (returnTo) revalidatePath(returnTo);
    redirectUrl = returnTo || "/properties";
  } catch (error) {
    const errorPath = returnTo || "/properties";
    redirectUrl = `${errorPath}?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to create property.",
    )}`;
  }

  redirect(redirectUrl);
}

export async function updatePropertyAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  let redirectUrl: string;
  const returnTo = String(formData.get("returnTo") ?? "").trim();
  try {
    const paymentPlansJson = parsePropertyPricingPlans(formData);
    const caller = await createServerCaller();
    await caller.workspace.updateProperty({
      propertyId,
      estateId: String(formData.get("estateId") ?? "").trim() || null,
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
      type: (String(formData.get("type") ?? "").trim() || null) as
        | "residential"
        | "commercial"
        | "land"
        | "industrial"
        | "mixed_use"
        | null,
      subType: String(formData.get("subType") ?? "").trim() || null,
      quantityAvailable: formData.get("quantityAvailable")
        ? Number(formData.get("quantityAvailable"))
        : null,
      paymentPlanMonths: formData.get("paymentPlanMonths")
        ? Number(formData.get("paymentPlanMonths"))
        : null,
      paymentPlanAmount:
        String(formData.get("paymentPlanAmount") ?? "").trim() || null,
      paymentPlanInitialDepositPercent: formData.get(
        "paymentPlanInitialDepositPercent",
      )
        ? Number(formData.get("paymentPlanInitialDepositPercent"))
        : null,
      paymentPlanMonthlyAmount:
        String(formData.get("paymentPlanMonthlyAmount") ?? "").trim() || null,
      paymentPlansJson,
      status: String(formData.get("status") ?? "active") as
        | "active"
        | "sold"
        | "rented"
        | "off_market",
      featured: formData.get("featured") === "true",
    });
    revalidatePath("/properties");
    if (returnTo) revalidatePath(returnTo);
    redirectUrl = returnTo || "/properties";
  } catch (error) {
    const errorPath = returnTo || "/properties";
    redirectUrl = `${errorPath}?error=${encodeURIComponent(
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

export async function createEstateAction(formData: FormData) {
  let redirectUrl: string;
  try {
    const session = await requireOnboardedSession();

    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim() || title;
    const slugResult = await getUniqueEstateSlugForCompany({
      companyId: session.activeMembership.companyId,
      requestedSlug: slugInput,
    });
    if (!slugResult.ok) {
      throw new Error("Database unavailable.");
    }
    const slug = slugResult.slug;

    const caller = await createServerCaller();
    await caller.workspace.createEstate({
      title,
      slug,
      description: String(formData.get("description") ?? "").trim() || null,
      amenities: String(formData.get("amenities") ?? "").trim() || null,
      approvals: String(formData.get("approvals") ?? "").trim() || null,
      brochureUrl: String(formData.get("brochureUrl") ?? "").trim() || null,
      heroImageUrl: String(formData.get("heroImageUrl") ?? "").trim() || null,
      landmarks: String(formData.get("landmarks") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      phaseLabel: String(formData.get("phaseLabel") ?? "").trim() || null,
      publishState: "draft",
      specialPurposeUses:
        String(formData.get("specialPurposeUses") ?? "").trim() || null,
    });

    revalidatePath("/estates");
    redirectUrl = `/estates/${slug}`;
  } catch (error) {
    redirectUrl = `/estates?error=${encodeURIComponent(
      error instanceof Error ? error.message : "Unable to create estate.",
    )}`;
  }

  redirect(redirectUrl);
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
  const redirectUrl = "/?domains=1";
  try {
    const caller = await createServerCaller();
    await caller.workspace.syncTenantDomains();

    revalidatePath("/");
    revalidatePath("/domains");
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
  const callbackUrl = `${await getRequestOrigin()}/billing/callback`;

  const caller = await createServerCaller();
  const result = await caller.workspace.initializeCheckout({
    callbackUrl,
    interval,
    planTier,
  });

  redirect(result.authorizationUrl);
}

export async function repairBillingPaymentAction(formData: FormData) {
  const reference = String(formData.get("reference") ?? "").trim();

  if (!reference) {
    redirect("/billing?payment=missing-reference");
  }

  redirect(`/billing/callback?reference=${encodeURIComponent(reference)}`);
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

// ─── Settings actions ─────────────────────────────────────────────────────

export async function updateCompanyProfileAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const market = String(formData.get("market") ?? "").trim() || null;
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.workspace.updateCompanyProfile({
      name: name || undefined,
      market,
    });
    revalidatePath("/settings");
    revalidatePath("/");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update profile.";
    errorRedirect = createRedirectUrl("/settings", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  } else {
    redirect("/settings?saved=1");
  }
}

export async function setCompanyLogoAction(input: FormData | string | null) {
  "use server";

  const logoUrl =
    input instanceof FormData
      ? input.get("logoUrl")
        ? String(input.get("logoUrl"))
        : null
      : input;

  try {
    const caller = await createServerCaller();
    await caller.workspace.setCompanyLogo({ logoUrl });
    revalidatePath("/");
    revalidatePath("/settings");
  } catch {
    // non-fatal
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

export async function connectCustomDomainAction(formData: FormData) {
  const hostname = String(formData.get("hostname") ?? "").trim();
  let redirectUrl = "/domains?connected=1";
  try {
    const caller = await createServerCaller();
    await caller.workspace.connectCustomDomain({ hostname });
    revalidatePath("/domains");
    revalidatePath("/");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to connect domain.";
    redirectUrl = createRedirectUrl("/domains/connect", { error: message });
  }
  redirect(redirectUrl);
}

export async function removeCustomDomainAction(formData: FormData) {
  const domainId = String(formData.get("domainId") ?? "").trim();
  let redirectUrl = "/domains?removed=1";
  try {
    const caller = await createServerCaller();
    await caller.workspace.removeCustomDomain({ domainId });
    revalidatePath("/domains");
    revalidatePath("/");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to remove domain.";
    redirectUrl = createRedirectUrl("/domains", { error: message });
  }
  redirect(redirectUrl);
}

// ─── Team management ──────────────────────────────────────────────────────

export async function acceptInviteAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.acceptInvite({ token });
    revalidatePath("/");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to accept invite.";
    errorRedirect = createRedirectUrl(`/join/${token}`, { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }

  if (role === "agent" || role === "staff") {
    redirect(`/join/${token}/complete`);
  }

  redirect("/");
}

export async function signUpForInviteAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  let redirectUrl: string | null = null;

  try {
    if (!name) {
      throw new Error("Full name is required.");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const inviteData = await getTeamInviteSignupData(token);

    if (!inviteData.ok) {
      let message: string;

      switch (inviteData.reason) {
        case "database-unavailable":
          message = "Database not configured.";
          break;
        case "invite-accepted":
          message = "Invite already accepted.";
          break;
        case "invite-revoked":
          message = "Invite has been revoked.";
          break;
        case "invite-expired":
          message = "Invite has expired.";
          break;
        case "user-exists":
          message = [
            "An account already exists for this email.",
            "Sign in to accept the invite.",
          ].join(" ");
          break;
        default:
          message = "Invite not found.";
      }

      throw new Error(message);
    }

    const { user } = await signUpUser({
      email: inviteData.email,
      emailVerified: true,
      name,
      password,
    });

    const acceptResult = await acceptTeamInviteForUser({
      token,
      userId: user.id,
    });
    if (!acceptResult.ok) {
      throw new Error("Database not configured.");
    }

    await setSessionCookie(user.id);

    revalidatePath("/team");
    revalidatePath("/agents");
    revalidatePath("/hr/employees");

    redirectUrl =
      inviteData.invite.role === "agent" || inviteData.invite.role === "staff"
        ? `/join/${token}/complete`
        : "/";
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create invite account.";
    redirectUrl = createRedirectUrl(`/join/${token}`, { error: message });
  }

  redirect(redirectUrl);
}

export async function inviteMemberAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "staff") as
    | "admin"
    | "agent"
    | "staff";

  await inviteWorkspaceUser({
    email,
    redirectPath: "/team",
    role,
    successRedirect: "/team?invited=1",
  });
}

export async function inviteAgentAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  await inviteWorkspaceUser({
    email,
    redirectPath: "/agents",
    role: "agent",
    successRedirect: "/agents?invited=1",
  });
}

export async function inviteEmployeeAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const rawWorkRole = String(formData.get("workRole") ?? "").trim();
  const workRole: WorkRole = EMPLOYEE_WORK_ROLE_VALUES.includes(
    rawWorkRole as never,
  )
    ? (rawWorkRole as WorkRole)
    : "operations";

  await inviteWorkspaceUser({
    email,
    redirectPath: "/hr/employees",
    role: "staff",
    successRedirect: "/hr/employees?invited=1",
    workRole,
  });
}

export async function completeInviteProfileAction(formData: FormData) {
  const session = await requireAuthenticatedSession();
  const token = String(formData.get("token") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!name) {
    redirect(
      createRedirectUrl(`/join/${token}/complete`, {
        error: "Name is required.",
      }),
    );
  }

  const inviteData = await getTeamInviteProfileCompletionData({
    token,
    userEmail: session.user.email,
  });

  if (!inviteData.ok) {
    const error =
      inviteData.reason === "email-mismatch"
        ? "This invite belongs to a different email address."
        : inviteData.reason === "invite-not-accepted"
          ? "Accept the invite before completing your profile."
          : inviteData.reason === "database-unavailable"
            ? "Database not configured."
            : "Invite not found.";
    const redirectPath =
      inviteData.reason === "email-mismatch" ||
      inviteData.reason === "invite-not-accepted"
        ? `/join/${token}`
        : "/";

    redirect(createRedirectUrl(redirectPath, { error }));
  }

  const { invite } = inviteData;
  const isAgentInvite = invite.role === "agent";
  const title = isAgentInvite
    ? "Agent"
    : (WORK_ROLE_LABELS[invite.workRole] ?? invite.workRole);
  const result = await completeTeamInviteProfile({
    bio: isAgentInvite ? String(formData.get("bio") ?? "").trim() || null : null,
    imageUrl: isAgentInvite
      ? String(formData.get("imageUrl") ?? "").trim() || null
      : null,
    name,
    phone,
    title,
    token,
    userEmail: session.user.email,
  });

  if (!result.ok) {
    const error =
      result.reason === "email-mismatch"
        ? "This invite belongs to a different email address."
        : result.reason === "invite-not-accepted"
          ? "Accept the invite before completing your profile."
          : result.reason === "database-unavailable"
            ? "Database not configured."
            : "Invite not found.";
    const redirectPath =
      result.reason === "email-mismatch" ||
      result.reason === "invite-not-accepted"
        ? `/join/${token}`
        : "/";

    redirect(createRedirectUrl(redirectPath, { error }));
  }

  if (result.profileKind === "agent") {
    revalidatePath("/agents");
  } else {
    revalidatePath("/hr/employees");
    revalidatePath("/hr/leave");
  }

  redirect("/?inviteProfileCompleted=1");
}

export async function updateMemberRoleAction(formData: FormData) {
  const membershipId = String(formData.get("membershipId") ?? "");
  const role = String(formData.get("role") ?? "staff") as
    | "admin"
    | "agent"
    | "staff";
  let errorRedirect: string | null = null;

  try {
    const caller = await createServerCaller();
    await caller.team.updateMemberRole({ membershipId, role });
    revalidatePath("/team");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update role.";
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
    const message =
      err instanceof Error ? err.message : "Failed to suspend member.";
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
    const message =
      err instanceof Error ? err.message : "Failed to reactivate member.";
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
    const message =
      err instanceof Error ? err.message : "Failed to remove member.";
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
    const message =
      err instanceof Error ? err.message : "Failed to revoke invite.";
    errorRedirect = createRedirectUrl("/team", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  }
}

// ─── Property media + publish state ──────────────────────────────────────

export async function uploadPropertyMediaAction(formData: FormData) {
  const propertyId = String(formData.get("propertyId") ?? "");
  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "image") as
    | "image"
    | "floor_plan";
  const isCover = formData.get("isCover") === "true";

  let errorRedirect: string | null = null;
  try {
    const session = await requireOnboardedSession();
    if (!file || !(file instanceof File)) {
      throw new Error("Choose a file to upload.");
    }

    const result = await createTenantAssetFromUpload({
      body: await file.arrayBuffer(),
      byteSize: file.size,
      companyId: session.activeMembership.companyId,
      contentType: file.type,
      fileName: file.name,
      scope: "properties",
      scopeId: propertyId,
    });
    if (!result.ok) {
      throw new Error(
        result.reason === "property-not-found"
          ? "Property not found."
          : "DB unavailable.",
      );
    }

    const caller = await createServerCaller();
    await caller.propertyMedia.addMedia({
      assetId: result.asset.id,
      isCover,
      kind,
      propertyId,
    });
    revalidatePath("/properties");
    revalidatePath(`/properties/${propertyId}`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload media.";
    errorRedirect = createRedirectUrl(`/properties/${propertyId}`, {
      error: message,
    });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
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

export async function markNotificationReadAction(formData: FormData) {
  const notificationId = String(formData.get("notificationId") ?? "");

  try {
    const caller = await createServerCaller();
    await caller.notifications.markRead({ notificationId });
    revalidatePath("/notifications");
  } catch {
    // Silent
  }
}

/** Convert a lead to a customer. */
export async function convertLeadToCustomerAction(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;

  let errorRedirect: string | null = null;
  try {
    const caller = await createServerCaller();
    await caller.customers.create({
      name,
      email,
      phone,
      status: "active",
      sourceLeadId: leadId,
    });
    // Also mark the lead as qualified after conversion
    await caller.workspace.updateLeadStatus({ leadId, status: "qualified" });
    revalidatePath("/leads");
    revalidatePath("/customers");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to convert lead.";
    errorRedirect = createRedirectUrl("/leads", { error: message });
  }

  if (errorRedirect) {
    redirect(errorRedirect);
  } else {
    redirect("/customers?created=1");
  }
}

// ---------------------------------------------------------------------------
// HR — Employee management
// ---------------------------------------------------------------------------

export async function createEmployeeAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim() || null;
  const rawWorkRole = String(formData.get("workRole") ?? "").trim();
  const departmentId =
    String(formData.get("departmentId") ?? "").trim() || null;
  const employmentType = String(
    formData.get("employmentType") ?? "full_time",
  ) as EmployeeEmploymentTypeValue;
  const startDateRaw = String(formData.get("startDate") ?? "").trim();
  const salaryRaw = String(formData.get("salaryAmount") ?? "").trim();
  const workRole = isWorkRole(rawWorkRole) ? rawWorkRole : "operations";

  if (!name) {
    redirect(
      createRedirectUrl("/hr/employees", { error: "Name is required." }),
    );
  }

  const result = await createCompanyEmployee({
    companyId,
    departmentId,
    email,
    employmentType,
    name,
    phone,
    salaryAmount: salaryRaw ? Number.parseInt(salaryRaw, 10) : null,
    startDate: startDateRaw ? new Date(startDateRaw) : null,
    title,
    workRole,
  });

  if (!result.ok) throw new Error("Database not configured.");

  revalidatePath("/hr/employees");
  redirect("/hr/employees?created=1");
}

export async function updateEmployeeAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const employeeId = String(formData.get("employeeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const rawEmail = formData.get("email");
  const rawPhone = formData.get("phone");
  const rawTitle = formData.get("title");
  const rawWorkRole = formData.get("workRole");
  const rawDepartmentId = formData.get("departmentId");
  const rawEmploymentType = formData.get("employmentType");
  const rawStatus = formData.get("status");
  const email = rawEmail === null ? undefined : String(rawEmail).trim() || null;
  const phone = rawPhone === null ? undefined : String(rawPhone).trim() || null;
  const title = rawTitle === null ? undefined : String(rawTitle).trim() || null;
  const departmentId =
    rawDepartmentId === null
      ? undefined
      : String(rawDepartmentId).trim() || null;
  const employmentType =
    rawEmploymentType === null
      ? undefined
      : (String(rawEmploymentType).trim() as EmployeeEmploymentTypeValue);
  const status =
    rawStatus === null
      ? undefined
      : (String(rawStatus).trim() as EmployeeStatusValue);
  const workRole: WorkRole | undefined =
    rawWorkRole === null
      ? undefined
      : isWorkRole(String(rawWorkRole).trim())
        ? (String(rawWorkRole).trim() as WorkRole)
        : "operations";

  const result = await updateCompanyEmployee({
    companyId,
    data: {
      departmentId,
      email,
      employmentType,
      name,
      phone,
      status,
      title,
      workRole,
    },
    employeeId,
  });

  if (!result.ok) throw new Error("Database not configured.");

  revalidatePath("/hr/employees");
}

export async function deleteEmployeeAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const employeeId = String(formData.get("employeeId") ?? "");
  const result = await deleteCompanyEmployee({ companyId, employeeId });

  if (!result.ok) throw new Error("Database not configured.");

  revalidatePath("/hr/employees");
}

// ---------------------------------------------------------------------------
// HR — Department management
// ---------------------------------------------------------------------------

export async function createDepartmentAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name) {
    redirect(
      createRedirectUrl("/hr/departments", { error: "Name is required." }),
    );
  }

  const result = await createCompanyDepartment({ companyId, description, name });

  if (!result.ok) throw new Error("Database not configured.");

  revalidatePath("/hr/departments");
  redirect("/hr/departments?created=1");
}

export async function updateDepartmentAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const departmentId = String(formData.get("departmentId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const result = await updateCompanyDepartment({
    companyId,
    data: { description, name },
    departmentId,
  });

  if (!result.ok) throw new Error("Database not configured.");

  revalidatePath("/hr/departments");
}

export async function deleteDepartmentAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const departmentId = String(formData.get("departmentId") ?? "");
  const result = await deleteCompanyDepartment({ companyId, departmentId });

  if (!result.ok) throw new Error("Database not configured.");

  revalidatePath("/hr/departments");
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------

function toCsvRow(
  fields: (string | number | boolean | null | undefined)[],
): string {
  return fields
    .map((f) => {
      const str = f == null ? "" : String(f);
      // Escape double quotes and wrap in quotes if necessary
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    })
    .join(",");
}

export async function exportLeadsCsvAction() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getLeadExportRows(companyId);
  if (!result.ok) throw new Error("Database not configured.");
  const leads = result.data;

  const header = toCsvRow([
    "Name",
    "Email",
    "Phone",
    "Source",
    "Status",
    "Message",
    "Created At",
  ]);
  const rows = leads.map((l) =>
    toCsvRow([
      l.name,
      l.email,
      l.phone,
      l.source,
      l.status,
      l.message,
      l.createdAt.toISOString(),
    ]),
  );

  return [header, ...rows].join("\n");
}

export async function exportPropertiesCsvAction() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getPropertyExportRows(companyId);
  if (!result.ok) throw new Error("Database not configured.");
  const properties = result.data;

  const header = toCsvRow([
    "Title",
    "Location",
    "Price",
    "Type",
    "Status",
    "Publish State",
    "Bedrooms",
    "Bathrooms",
    "Featured",
    "Created At",
  ]);
  const rows = properties.map((p) =>
    toCsvRow([
      p.title,
      p.location,
      p.price,
      p.type,
      p.status,
      p.publishState,
      p.bedrooms,
      p.bathrooms,
      p.featured ? "Yes" : "No",
      p.createdAt.toISOString(),
    ]),
  );

  return [header, ...rows].join("\n");
}

export async function exportCustomersCsvAction() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getCustomerExportRows(companyId);
  if (!result.ok) throw new Error("Database not configured.");
  const customers = result.data;

  const header = toCsvRow([
    "Name",
    "Email",
    "Phone",
    "Status",
    "Notes",
    "Created At",
  ]);
  const rows = customers.map((c) =>
    toCsvRow([
      c.name,
      c.email,
      c.phone,
      c.status,
      c.notes,
      c.createdAt.toISOString(),
    ]),
  );

  return [header, ...rows].join("\n");
}

export async function exportAppointmentsCsvAction() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getAppointmentExportRows(companyId);
  if (!result.ok) throw new Error("Database not configured.");
  const appointments = result.data;

  const header = toCsvRow([
    "Client Name",
    "Client Email",
    "Client Phone",
    "Property",
    "Agent",
    "Scheduled At",
    "Status",
    "Notes",
    "Created At",
  ]);
  const rows = appointments.map((a) =>
    toCsvRow([
      a.name,
      a.email,
      a.phone,
      a.property?.title,
      a.agent?.name,
      a.scheduledAt.toISOString(),
      a.status,
      a.notes,
      a.createdAt.toISOString(),
    ]),
  );

  return [header, ...rows].join("\n");
}

export async function exportEmployeesCsvAction() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getEmployeeExportRows(companyId);
  if (!result.ok) throw new Error("Database not configured.");
  const employees = result.data;

  const header = toCsvRow([
    "Name",
    "Email",
    "Phone",
    "Title",
    "Department",
    "Employment Type",
    "Status",
    "Start Date",
    "Created At",
  ]);
  const rows = employees.map((e) =>
    toCsvRow([
      e.name,
      e.email,
      e.phone,
      e.title,
      e.department?.name,
      e.employmentType,
      e.status,
      e.startDate?.toISOString(),
      e.createdAt.toISOString(),
    ]),
  );

  return [header, ...rows].join("\n");
}

// ---------------------------------------------------------------------------
// HR — Leave request management
// ---------------------------------------------------------------------------

export async function createLeaveRequestAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const leaveType = String(
    formData.get("leaveType") ?? "annual",
  ) as LeaveTypeValue;
  const startDateRaw = String(formData.get("startDate") ?? "").trim();
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (!employeeId || !startDateRaw || !endDateRaw) {
    redirect(
      createRedirectUrl("/hr/leave", {
        error: "Employee, start date, and end date are required.",
      }),
    );
  }

  const result = await createCompanyLeaveRequest({
    companyId,
    employeeId,
    endDate: new Date(endDateRaw),
    leaveType,
    reason,
    startDate: new Date(startDateRaw),
  });

  if (!result.ok && result.reason === "database-unavailable") {
    throw new Error("Database not configured.");
  }

  if (!result.ok) {
    redirect(createRedirectUrl("/hr/leave", { error: "Employee not found." }));
  }

  revalidatePath("/hr/leave");
  redirect("/hr/leave?created=1");
}

export async function approveLeaveRequestAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const leaveRequestId = String(formData.get("leaveRequestId") ?? "");
  const result = await setCompanyLeaveRequestStatus({
    approvedById: session.user.id,
    companyId,
    leaveRequestId,
    status: "approved",
  });

  if (!result.ok && result.reason === "database-unavailable") {
    throw new Error("Database not configured.");
  }

  if (!result.ok) return;

  revalidatePath("/hr/leave");
}

export async function rejectLeaveRequestAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const leaveRequestId = String(formData.get("leaveRequestId") ?? "");
  const result = await setCompanyLeaveRequestStatus({
    companyId,
    leaveRequestId,
    status: "rejected",
  });

  if (!result.ok && result.reason === "database-unavailable") {
    throw new Error("Database not configured.");
  }

  if (!result.ok) return;

  revalidatePath("/hr/leave");
}

export async function cancelLeaveRequestAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const leaveRequestId = String(formData.get("leaveRequestId") ?? "");
  const result = await setCompanyLeaveRequestStatus({
    companyId,
    leaveRequestId,
    status: "cancelled",
  });

  if (!result.ok && result.reason === "database-unavailable") {
    throw new Error("Database not configured.");
  }

  if (!result.ok) return;

  revalidatePath("/hr/leave");
}

// ---------------------------------------------------------------------------
// HR — Payroll management
// ---------------------------------------------------------------------------

export async function createPayrollEntryAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const periodYear = Number.parseInt(
    String(formData.get("periodYear") ?? ""),
    10,
  );
  const periodMonth = Number.parseInt(
    String(formData.get("periodMonth") ?? ""),
    10,
  );
  const grossAmount = Number.parseInt(
    String(formData.get("grossAmount") ?? "0"),
    10,
  );
  const netAmount = Number.parseInt(
    String(formData.get("netAmount") ?? "0"),
    10,
  );
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!employeeId || !periodYear || !periodMonth) {
    redirect(
      createRedirectUrl("/hr/payroll", {
        error: "Employee, year, and month are required.",
      }),
    );
  }

  const result = await createCompanyPayrollEntry({
    companyId,
    employeeId,
    grossAmount,
    netAmount,
    notes,
    periodMonth,
    periodYear,
  });

  if (!result.ok && result.reason === "database-unavailable") {
    throw new Error("Database not configured.");
  }

  if (!result.ok) {
    redirect(
      createRedirectUrl("/hr/payroll", { error: "Employee not found." }),
    );
  }

  revalidatePath("/hr/payroll");
  redirect(`/hr/payroll?year=${periodYear}&month=${periodMonth}&created=1`);
}

export async function markPayrollPaidAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const payrollEntryId = String(formData.get("payrollEntryId") ?? "");
  const result = await markCompanyPayrollPaid({ companyId, payrollEntryId });

  if (!result.ok) {
    throw new Error("Database not configured.");
  }

  revalidatePath("/hr/payroll");
}

// ---------------------------------------------------------------------------
// Notification preferences
// ---------------------------------------------------------------------------

export async function updateNotificationPreferenceAction(formData: FormData) {
  const type = String(formData.get("type") ?? "");
  const channel = String(formData.get("channel") ?? "");
  const enabled = String(formData.get("enabled") ?? "true") === "true";
  const currentInApp =
    String(formData.get("currentInApp") ?? "true") === "true";
  const currentEmail =
    String(formData.get("currentEmail") ?? "true") === "true";

  if (!type || !channel) return;

  const inApp = channel === "inApp" ? enabled : currentInApp;
  const email = channel === "email" ? enabled : currentEmail;

  const caller = await createServerCaller();
  await caller.notifications.updatePreference({ email, inApp, type });

  revalidatePath("/settings/notifications");
}

// ---------------------------------------------------------------------------
// Reports CSV exports
// ---------------------------------------------------------------------------

export async function exportBusinessSummaryCsvAction(
  year: number,
  month: number,
): Promise<string> {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getBusinessSummaryCsv({ companyId, month, year });
  if (!result.ok) throw new Error("Database not configured.");
  return result.csv;
}

export async function exportAgentReportCsvAction(
  year: number,
  month: number,
): Promise<string> {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getAgentReportCsv({ companyId, month, year });
  if (!result.ok) throw new Error("Database not configured.");
  return result.csv;
}

export async function exportListingsReportCsvAction(): Promise<string> {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await getListingsReportCsv({ companyId });
  if (!result.ok) throw new Error("Database not configured.");
  return result.csv;
}

// ---------------------------------------------------------------------------
// Integrations settings
// ---------------------------------------------------------------------------

export async function updateIntegrationsAction(formData: FormData) {
  const googleAnalyticsId =
    String(formData.get("googleAnalyticsId") ?? "").trim() || null;
  const facebookPixelId =
    String(formData.get("facebookPixelId") ?? "").trim() || null;
  const whatsappPhone =
    String(formData.get("whatsappPhone") ?? "").trim() || null;
  const calendlyUrl = String(formData.get("calendlyUrl") ?? "").trim() || null;

  const caller = await createServerCaller();
  await caller.workspace.updateCompanyIntegration({
    calendlyUrl,
    facebookPixelId,
    googleAnalyticsId,
    whatsappPhone,
  });

  revalidatePath("/integrations");
  revalidatePath("/settings/integrations");
  redirect("/settings/integrations?saved=1");
}

// ---------------------------------------------------------------------------
// Workspace app store — install / uninstall apps
// ---------------------------------------------------------------------------

export async function installAppAction(appKey: string) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await installCompanyApp({ appKey, companyId });
  if (!result.ok) throw new Error("DATABASE_URL is not configured.");
  revalidatePath("/app-store");
}

export async function uninstallAppAction(appKey: string) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const result = await uninstallCompanyApp({ appKey, companyId });
  if (!result.ok) throw new Error("DATABASE_URL is not configured.");
  revalidatePath("/app-store");
}
