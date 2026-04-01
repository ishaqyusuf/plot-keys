import { NextResponse } from "next/server";

import { clearPortalCustomerSessionCookie } from "../../../lib/customer-session";
import { resolveTenantShell } from "../../../lib/resolve-tenant";

export async function POST(request: Request) {
  const shell = await resolveTenantShell();

  if (shell) {
    await clearPortalCustomerSessionCookie(shell.company.slug);
  }

  return NextResponse.redirect(new URL("/portal/login?signedOut=true", request.url));
}
