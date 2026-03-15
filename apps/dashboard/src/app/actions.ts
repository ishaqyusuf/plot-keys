"use server";

import {
  authRoutes,
  authSessionCookieName,
  createSessionToken,
  resolvePostVerificationRoute,
  signInUser,
  signUpUser,
  verifyUserEmail,
} from "@plotkeys/auth";
import { createPrismaClient, findCompanyById } from "@plotkeys/db";
import {
  createInitialSiteConfigurationInput,
  getTemplateDefinition,
} from "@plotkeys/section-registry";
import {
  buildDashboardHostname,
  buildSitefrontHostname,
  describeTemplateAccess,
  isVercelDomainProvisioningConfigured,
  normalizeSubdomainLabel,
  plotkeysRootDomain,
  type SubscriptionTier,
  syncTenantDomainWithVercel,
} from "@plotkeys/utils";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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

function assertTemplateAccess(planTier: SubscriptionTier, templateKey: string) {
  const template = getTemplateDefinition(templateKey);
  const templateAccess = describeTemplateAccess(planTier, template.tier);

  if (!templateAccess.allowed) {
    throw new Error(templateAccess.message);
  }
}

async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set(authSessionCookieName, createSessionToken(userId), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
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

  cookieStore.delete(authSessionCookieName);
  clearPendingOnboardingCookie(cookieStore);
  redirect(authRoutes.signIn);
}

export async function completeOnboardingAction(formData: FormData) {
  const session = await requireAuthenticatedSession();
  const prisma = createPrismaClient().db;
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);

  if (!prisma) {
    redirect(
      createRedirectUrl(authRoutes.onboarding, {
        error: "DATABASE_URL is not configured.",
      }),
    );
  }

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

    await assertSubdomainAvailability(prisma, subdomain);
    assertTemplateAccess("starter", templateKey);

    const initialSiteConfiguration = createInitialSiteConfigurationInput({
      companyName,
      market,
      subdomain,
      templateKey,
    });

    const siteConfiguration = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          market,
          name: companyName,
          planStartedAt: new Date(),
          planStatus: "active",
          planTier: "starter",
          slug: subdomain,
        },
      });

      await tx.membership.create({
        data: {
          companyId: company.id,
          role: "owner",
          status: "active",
          userId: session.user.id,
        },
      });

      await tx.tenantDomain.createMany({
        data: [
          {
            apexDomain: plotkeysRootDomain,
            companyId: company.id,
            hostname: buildSitefrontHostname(subdomain),
            kind: "sitefront_subdomain",
            status: "pending",
            subdomainLabel: subdomain,
            vercelProjectKey: "sitefront",
          },
          {
            apexDomain: plotkeysRootDomain,
            companyId: company.id,
            hostname: buildDashboardHostname(subdomain),
            kind: "dashboard_subdomain",
            status: "pending",
            subdomainLabel: `dashboard.${subdomain}`,
            vercelProjectKey: "dashboard",
          },
        ],
      });

      return tx.siteConfiguration.create({
        data: {
          ...initialSiteConfiguration,
          companyId: company.id,
          createdById: session.user.id,
          publishedAt: new Date(),
          status: "published",
          updatedById: session.user.id,
        },
      });
    });

    clearPendingOnboardingCookie(cookieStore);
    redirect(`/builder?configId=${siteConfiguration.id}`);
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
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    redirect("/builder?error=DATABASE_URL is not configured.");
  }

  const templateKey = String(formData.get("templateKey") ?? "template-1");
  const company = await findCompanyById(
    prisma,
    session.activeMembership.companyId,
  );

  if (!company) {
    redirect("/builder?error=Company not found.");
  }

  try {
    assertTemplateAccess(company.planTier, templateKey);
  } catch (error) {
    redirect(
      `/builder?error=${encodeURIComponent(
        error instanceof Error
          ? error.message
          : "Template access is unavailable.",
      )}`,
    );
  }

  const existingDraft = await prisma.siteConfiguration.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      companyId: company.id,
      deletedAt: null,
      status: "draft",
      templateKey,
    },
  });

  if (existingDraft) {
    redirect(`/builder?configId=${existingDraft.id}`);
  }

  const initialSiteConfiguration = createInitialSiteConfigurationInput({
    companyName: company.name,
    market: company.market ?? session.activeMembership.companyName,
    subdomain: company.slug,
    templateKey,
  });

  const configuration = await prisma.siteConfiguration.create({
    data: {
      ...initialSiteConfiguration,
      companyId: company.id,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  redirect(`/builder?configId=${configuration.id}`);
}

export async function updateSiteFieldAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    redirect("/builder?error=DATABASE_URL is not configured.");
  }

  const configId = String(formData.get("configId") ?? "");
  const contentKey = String(formData.get("contentKey") ?? "");
  const value = String(formData.get("value") ?? "");
  const configuration = await prisma.siteConfiguration.findFirst({
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
      id: configId,
    },
  });

  if (!configuration) {
    redirect("/builder?error=Template configuration not found.");
  }

  const currentContent = configuration.contentJson as Record<string, string>;

  await prisma.siteConfiguration.update({
    where: {
      id: configuration.id,
    },
    data: {
      contentJson: {
        ...currentContent,
        [contentKey]: value,
      },
      updatedById: session.user.id,
      version: configuration.version + 1,
    },
  });

  revalidatePath("/builder");
  revalidatePath("/live");
  redirect(`/builder?configId=${configuration.id}&saved=1`);
}

export async function publishSiteConfigurationAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    redirect("/builder?error=DATABASE_URL is not configured.");
  }

  const configId = String(formData.get("configId") ?? "");
  const nextName = String(formData.get("nextName") ?? "").trim();
  const configuration = await prisma.siteConfiguration.findFirst({
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
      id: configId,
    },
  });

  if (!configuration) {
    redirect("/builder?error=Template configuration not found.");
  }

  await prisma.$transaction([
    prisma.siteConfiguration.updateMany({
      data: {
        status: "draft",
        updatedById: session.user.id,
      },
      where: {
        companyId: session.activeMembership.companyId,
        deletedAt: null,
        status: "published",
      },
    }),
    prisma.siteConfiguration.update({
      where: {
        id: configuration.id,
      },
      data: {
        name: nextName || configuration.name,
        publishedAt: new Date(),
        status: "published",
        updatedById: session.user.id,
        version: configuration.version + 1,
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/builder");
  revalidatePath("/live");
  redirect(`/builder?configId=${configuration.id}&published=1`);
}

export async function switchBuilderConfigurationAction(formData: FormData) {
  const configurationId = String(formData.get("configId") ?? "");

  redirect(`/builder?configId=${configurationId}`);
}

export async function smartFillFieldAction(formData: FormData) {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    redirect("/builder?error=DATABASE_URL is not configured.");
  }

  const configId = String(formData.get("configId") ?? "");
  const contentKey = String(formData.get("contentKey") ?? "");
  const shortDetail = String(formData.get("shortDetail") ?? "");
  const configuration = await prisma.siteConfiguration.findFirst({
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
      id: configId,
    },
  });

  if (!configuration) {
    redirect("/builder?error=Template configuration not found.");
  }

  const currentContent = configuration.contentJson as Record<string, string>;
  const suggestion =
    contentKey === "hero.title"
      ? `${session.activeMembership.companyName} unlocks better moves.`
      : `${shortDetail} for ${session.activeMembership.companyName}.`;

  await prisma.siteConfiguration.update({
    where: {
      id: configuration.id,
    },
    data: {
      contentJson: {
        ...currentContent,
        [contentKey]: suggestion,
      },
      updatedById: session.user.id,
      version: configuration.version + 1,
    },
  });

  redirect(`/builder?configId=${configuration.id}&generated=1`);
}

export async function ensureBuilderConfigurationExists() {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    redirect("/sign-in?error=DATABASE_URL is not configured.");
  }

  const configuration = await prisma.siteConfiguration.findFirst({
    orderBy: [
      {
        status: "asc",
      },
      {
        updatedAt: "desc",
      },
    ],
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
    },
  });

  if (!configuration) {
    const company = await findCompanyById(
      prisma,
      session.activeMembership.companyId,
    );

    if (!company) {
      redirect("/onboarding?error=Company not found.");
    }

    const initialSiteConfiguration = createInitialSiteConfigurationInput({
      companyName: company.name,
      market: company.market ?? company.name,
      subdomain: company.slug,
      templateKey: getTemplateDefinition("template-1").key,
    });

    const createdConfiguration = await prisma.siteConfiguration.create({
      data: {
        ...initialSiteConfiguration,
        companyId: company.id,
        createdById: session.user.id,
        publishedAt: new Date(),
        status: "published",
        updatedById: session.user.id,
      },
    });

    redirect(`/builder?configId=${createdConfiguration.id}`);
  }
}

export async function syncTenantDomainsAction() {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;

  if (!prisma) {
    redirect("/?error=DATABASE_URL is not configured.");
  }

  if (!isVercelDomainProvisioningConfigured()) {
    redirect("/?error=Vercel domain provisioning env vars are not configured.");
  }

  const domains = await prisma.tenantDomain.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      companyId: session.activeMembership.companyId,
      deletedAt: null,
      status: {
        in: ["failed", "pending", "provisioning"],
      },
    },
  });

  for (const domain of domains) {
    try {
      await prisma.tenantDomain.update({
        where: {
          id: domain.id,
        },
        data: {
          lastError: null,
          status: "provisioning",
        },
      });

      const syncedDomain = await syncTenantDomainWithVercel(domain);

      await prisma.tenantDomain.update({
        where: {
          id: domain.id,
        },
        data: {
          lastError: syncedDomain.lastError,
          provisionedAt: syncedDomain.provisionedAt,
          status: syncedDomain.status,
          verificationJson: syncedDomain.verificationJson ?? undefined,
          vercelDomainName: syncedDomain.vercelDomainName,
        },
      });
    } catch (error) {
      await prisma.tenantDomain.update({
        where: {
          id: domain.id,
        },
        data: {
          lastError:
            error instanceof Error
              ? error.message
              : "Unable to sync tenant domain.",
          status: "failed",
        },
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/live");
  redirect("/?domains=1");
}
