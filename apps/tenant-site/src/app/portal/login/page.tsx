import Link from "next/link";

import { PortalCard, PortalPage } from "../../../components/portal-page";

export default function PortalLoginPage() {
  return (
    <PortalPage
      description="Sign in as a customer to view saved listings, track offers, and manage payments from one central branded portal."
      eyebrow="Portal access"
      title="Customer login"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <PortalCard title="Sign in">
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]"
                htmlFor="portal-login-email"
              >
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)] px-4 py-3 text-sm text-[color:var(--pk-foreground,#0f172a)] outline-none transition focus:border-[color:var(--pk-primary,#0f766e)] focus:ring-2 focus:ring-[color:var(--pk-primary,#0f766e)]/20"
                id="portal-login-email"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]"
                htmlFor="portal-login-password"
              >
                Password
              </label>
              <input
                className="w-full rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)] px-4 py-3 text-sm text-[color:var(--pk-foreground,#0f172a)] outline-none transition focus:border-[color:var(--pk-primary,#0f766e)] focus:ring-2 focus:ring-[color:var(--pk-primary,#0f766e)]/20"
                id="portal-login-password"
                placeholder="Enter your password"
                type="password"
              />
            </div>
            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--pk-primary,#0f766e)] px-4 py-3 text-sm font-semibold text-[color:var(--pk-primary-foreground,#ffffff)] shadow-sm transition hover:opacity-95"
              type="button"
            >
              Continue to portal
            </button>
          </form>
        </PortalCard>

        <PortalCard title="Foundation scope">
          <div className="space-y-4 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            <p>
              This phase establishes the central customer portal routes and
              branded shell. Customer authentication wiring lands in the next
              phase on top of this foundation.
            </p>
            <p>
              New here?{" "}
              <Link
                className="font-medium text-[color:var(--pk-primary,#0f766e)] underline-offset-4 hover:underline"
                href="/portal/signup"
              >
                Create an account
              </Link>
              .
            </p>
          </div>
        </PortalCard>
      </div>
    </PortalPage>
  );
}
