"use server";

import {
  createBetterAuthSession,
  signInUser,
  signUpUser,
} from "@plotkeys/auth";
import {
  createCustomer,
  createPrismaClient,
  findCustomerByEmailForCompany,
  isListingSavedForCustomer,
  removeSavedListingForCustomer,
  saveListingForCustomer,
} from "@plotkeys/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearPortalCustomerSessionCookie,
  getPortalCustomerSession,
  setPortalCustomerSessionCookie,
} from "../../lib/customer-session";
import { resolveTenantShell } from "../../lib/resolve-tenant";

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function assertEmail(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  return normalized;
}

function assertPassword(value: string) {
  if (!value) {
    throw new Error("Password is required.");
  }

  return value;
}

function assertSignupPassword(value: string) {
  if (value.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  return value;
}

function assertRequired(value: string, label: string) {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function buildErrorRedirect(
  pathname: string,
  message: string,
  extraParams?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  params.set("error", message);

  for (const [key, value] of Object.entries(extraParams ?? {})) {
    if (value) {
      params.set(key, value);
    }
  }

  return `${pathname}?${params.toString()}`;
}

function normalizeRedirectTarget(
  value: string | undefined,
  fallback = "/portal/dashboard",
) {
  if (!value?.trim()) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

function buildRedirectWithStatus(
  pathname: string,
  status:
    | "already-saved"
    | "removed"
    | "saved"
    | "sign-in-required",
) {
  const url = new URL(pathname, "https://portal.plotkeys.local");
  url.searchParams.set("savedStatus", status);
  return `${url.pathname}${url.search}`;
}

export async function signInCustomerAction(formData: FormData) {
  const redirectTo = normalizeString(formData.get("redirectTo"));
  let email = "";
  let password = "";

  try {
    email = assertEmail(normalizeString(formData.get("email")));
    password = assertPassword(normalizeString(formData.get("password")));
  } catch (error) {
    redirect(
      buildErrorRedirect(
        "/portal/login",
        error instanceof Error ? error.message : "Unable to sign in.",
        { redirect: redirectTo || undefined },
      ),
    );
  }

  const shell = await resolveTenantShell();
  const prisma = createPrismaClient().db;

  if (!shell || !prisma) {
    redirect(
      buildErrorRedirect(
        "/portal/login",
        "Customer portal is not available for this tenant.",
        { redirect: redirectTo || undefined },
      ),
    );
  }

  try {
    const user = await signInUser({
      email,
      password,
    });

    const customer = await findCustomerByEmailForCompany(prisma, {
      companyId: shell.company.id,
      email: user.email,
    });

    if (!customer) {
      throw new Error(
        "No customer account exists for this email in the current portal.",
      );
    }

    const { signedSessionToken } = await createBetterAuthSession(user.id);
    await setPortalCustomerSessionCookie({
      signedSessionToken,
      tenantSlug: shell.company.slug,
    });
  } catch (error) {
    redirect(
      buildErrorRedirect(
        "/portal/login",
        error instanceof Error ? error.message : "Unable to sign in.",
        { redirect: redirectTo || undefined },
      ),
    );
  }

  redirect(normalizeRedirectTarget(redirectTo));
}

export async function signUpCustomerAction(formData: FormData) {
  const redirectTo = normalizeString(formData.get("redirectTo"));
  let email = "";
  let firstName = "";
  let lastName = "";
  let password = "";

  try {
    email = assertEmail(normalizeString(formData.get("email")));
    firstName = assertRequired(
      normalizeString(formData.get("firstName")),
      "First name",
    );
    lastName = assertRequired(
      normalizeString(formData.get("lastName")),
      "Last name",
    );
    password = assertSignupPassword(normalizeString(formData.get("password")));
  } catch (error) {
    redirect(
      buildErrorRedirect(
        "/portal/signup",
        error instanceof Error ? error.message : "Unable to create account.",
        { redirect: redirectTo || undefined },
      ),
    );
  }

  const shell = await resolveTenantShell();
  const prisma = createPrismaClient().db;

  if (!shell || !prisma) {
    redirect(
      buildErrorRedirect(
        "/portal/signup",
        "Customer portal is not available for this tenant.",
        { redirect: redirectTo || undefined },
      ),
    );
  }

  const fullName = `${firstName} ${lastName}`.trim();

  try {
    const { user } = await signUpUser({
      db: prisma,
      email,
      emailVerified: true,
      name: fullName,
      password,
      phoneNumber: null,
    });

    const existingCustomer = await findCustomerByEmailForCompany(prisma, {
      companyId: shell.company.id,
      email: user.email,
    });

    if (!existingCustomer) {
      await createCustomer(prisma, {
        companyId: shell.company.id,
        email: user.email,
        name: fullName,
      });
    }

    const { signedSessionToken } = await createBetterAuthSession(user.id);
    await setPortalCustomerSessionCookie({
      signedSessionToken,
      tenantSlug: shell.company.slug,
    });
  } catch (error) {
    redirect(
      buildErrorRedirect(
        "/portal/signup",
        error instanceof Error ? error.message : "Unable to create account.",
        { redirect: redirectTo || undefined },
      ),
    );
  }

  const target = normalizeRedirectTarget(redirectTo, "/portal/dashboard");
  const url = new URL(target, "https://portal.plotkeys.local");

  if (url.pathname === "/portal/dashboard") {
    url.searchParams.set("signup", "successful");
  }

  redirect(`${url.pathname}${url.search}`);
}

export async function signOutCustomerAction() {
  const shell = await resolveTenantShell();

  if (shell) {
    await clearPortalCustomerSessionCookie(shell.company.slug);
  }

  redirect("/portal/login?signedOut=true");
}

export async function toggleSavedListingAction(formData: FormData) {
  const propertyId = assertRequired(
    normalizeString(formData.get("propertyId")),
    "Property",
  );
  const redirectTo = normalizeRedirectTarget(
    normalizeString(formData.get("redirectTo")),
    `/property/${propertyId}`,
  );
  const mode = normalizeString(formData.get("mode")) === "remove"
    ? "remove"
    : "save";

  const [shell, session] = await Promise.all([
    resolveTenantShell(),
    getPortalCustomerSession(),
  ]);
  const prisma = createPrismaClient().db;

  if (!shell || !prisma) {
    redirect(
      buildErrorRedirect(
        "/portal/login",
        "Customer portal is not available for this tenant.",
      ),
    );
  }

  if (!session) {
    redirect(
      `/portal/login?redirect=${encodeURIComponent(redirectTo)}&savedStatus=sign-in-required`,
    );
  }

  const scope = {
    companyId: shell.company.id,
    customerId: session.customer.id,
    propertyId,
  };

  if (mode === "remove") {
    await removeSavedListingForCustomer(prisma, scope);
    revalidatePath("/portal/dashboard");
    revalidatePath("/portal/saved");
    revalidatePath(`/property/${propertyId}`);
    redirect(buildRedirectWithStatus(redirectTo, "removed"));
  }

  const alreadySaved = await isListingSavedForCustomer(prisma, scope);

  if (alreadySaved) {
    redirect(buildRedirectWithStatus(redirectTo, "already-saved"));
  }

  await saveListingForCustomer(prisma, scope);
  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/saved");
  revalidatePath(`/property/${propertyId}`);
  redirect(buildRedirectWithStatus(redirectTo, "saved"));
}
