import Link from "next/link";
import type { ReactNode } from "react";

type PortalShellProps = {
  children: ReactNode;
  companyName: string;
  currentPath: string;
  logoUrl?: string | null;
};

const portalNavLinks = [
  { href: "/portal/login", label: "Login" },
  { href: "/portal/signup", label: "Sign Up" },
  { href: "/portal/dashboard", label: "Dashboard" },
  { href: "/portal/saved", label: "Saved" },
  { href: "/portal/offers", label: "Offers" },
  { href: "/portal/payments", label: "Payments" },
  { href: "/portal/account", label: "Account" },
];

function isActiveLink(currentPath: string, href: string) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function PortalShell({
  children,
  companyName,
  currentPath,
  logoUrl,
}: PortalShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--pk-background,#f8fafc)_0%,rgba(255,255,255,0.98)_100%)] px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto max-w-[84rem] overflow-hidden rounded-[2rem] border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)]/80 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="grid lg:grid-cols-[19rem_1fr]">
          <aside className="border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)]/95 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="h-12 w-12 rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)] bg-cover bg-center shadow-sm"
                style={
                  logoUrl ? { backgroundImage: `url(${logoUrl})` } : undefined
                }
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--pk-muted-foreground,#64748b)]">
                  Customer portal
                </p>
                <p className="mt-1 text-lg font-semibold text-[color:var(--pk-foreground,#0f172a)]">
                  {companyName}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)]/90 p-4">
              <p className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]">
                Central portal foundation
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--pk-muted-foreground,#64748b)]">
                These routes are shared application pages that inherit tenant
                branding, rather than template-composed marketing pages.
              </p>
            </div>

            <nav
              aria-label="Customer portal navigation"
              className="mt-8 space-y-2"
            >
              {portalNavLinks.map((link) => {
                const active = isActiveLink(currentPath, link.href);

                return (
                  <Link
                    key={link.href}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "border-[color:var(--pk-primary,#0f766e)] bg-[color:var(--pk-primary,#0f766e)] text-[color:var(--pk-primary-foreground,#ffffff)]"
                        : "border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] text-[color:var(--pk-foreground,#0f172a)] hover:border-[color:var(--pk-primary,#0f766e)]/40 hover:text-[color:var(--pk-primary,#0f766e)]"
                    }`}
                    href={link.href}
                  >
                    <span>{link.label}</span>
                    {active ? <span aria-hidden="true">•</span> : null}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="p-6 md:p-8 lg:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
