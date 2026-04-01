import {
  authSessionCookieName,
  getAppSessionFromBetterAuth,
  getScopedAuthSessionCookieName,
} from "@plotkeys/auth";
import {
  createPrismaClient,
  findCustomerByEmailForCompany,
} from "@plotkeys/db";
import { cookies, headers } from "next/headers";

import { resolveTenantShell } from "./resolve-tenant";

export type PortalCustomerSession = {
  company: {
    id: string;
    name: string;
    slug: string;
  };
  customer: {
    email: string | null;
    id: string;
    name: string;
    phone: string | null;
    status: string;
  };
  user: {
    email: string;
    id: string;
    name: string | null;
    phoneNumber: string | null;
  };
};

export async function getPortalCustomerSession(): Promise<PortalCustomerSession | null> {
  const prisma = createPrismaClient().db;
  if (!prisma) return null;

  const [requestHeaders, shell] = await Promise.all([headers(), resolveTenantShell()]);
  if (!shell) return null;

  const appSession = await getAppSessionFromBetterAuth(requestHeaders);
  if (!appSession?.user.email) return null;

  const customer = await findCustomerByEmailForCompany(prisma, {
    companyId: shell.company.id,
    email: appSession.user.email,
  });

  if (!customer) {
    return null;
  }

  return {
    company: {
      id: shell.company.id,
      name: shell.company.name,
      slug: shell.company.slug,
    },
    customer: {
      email: customer.email,
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      status: customer.status,
    },
    user: {
      email: appSession.user.email,
      id: appSession.user.id,
      name: appSession.user.name,
      phoneNumber: appSession.user.phoneNumber,
    },
  };
}

export async function setPortalCustomerSessionCookie(input: {
  signedSessionToken: string;
  tenantSlug: string;
}) {
  const cookieStore = await cookies();

  cookieStore.set(
    getScopedAuthSessionCookieName(input.tenantSlug),
    input.signedSessionToken,
    {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

export async function clearPortalCustomerSessionCookie(tenantSlug: string) {
  const cookieStore = await cookies();
  cookieStore.delete(getScopedAuthSessionCookieName(tenantSlug));
  cookieStore.delete(authSessionCookieName);
}
