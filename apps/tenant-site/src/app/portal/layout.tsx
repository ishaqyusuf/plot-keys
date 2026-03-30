import { headers } from "next/headers";
import type { ReactNode } from "react";

import { PortalShell } from "../../components/portal-shell";
import { resolveTenantShell } from "../../lib/resolve-tenant";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [requestHeaders, shell] = await Promise.all([
    headers(),
    resolveTenantShell(),
  ]);

  if (!shell) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-16 text-center">
        <div className="max-w-xl rounded-[1.75rem] border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Customer portal
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            This portal is not available yet.
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            A published tenant site is required before customer portal routes
            can inherit branding and become available.
          </p>
        </div>
      </main>
    );
  }

  return (
    <PortalShell
      companyName={shell.company.name}
      currentPath={requestHeaders.get("x-tenant-pathname") ?? "/portal"}
      logoUrl={shell.company.logoUrl}
    >
      {children}
    </PortalShell>
  );
}
