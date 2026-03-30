import Link from "next/link";

import { PortalCard, PortalPage } from "../../../components/portal-page";

export default function PortalSignupPage() {
  return (
    <PortalPage
      description="Create a customer account to save listings, monitor offers, and manage your relationship with this company from one central portal."
      eyebrow="Portal access"
      title="Customer sign up"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <PortalCard title="Create your account">
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]"
                  htmlFor="portal-signup-first-name"
                >
                  First name
                </label>
                <input
                  className="w-full rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)] px-4 py-3 text-sm text-[color:var(--pk-foreground,#0f172a)] outline-none transition focus:border-[color:var(--pk-primary,#0f766e)] focus:ring-2 focus:ring-[color:var(--pk-primary,#0f766e)]/20"
                  id="portal-signup-first-name"
                  placeholder="Amina"
                  type="text"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]"
                  htmlFor="portal-signup-last-name"
                >
                  Last name
                </label>
                <input
                  className="w-full rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)] px-4 py-3 text-sm text-[color:var(--pk-foreground,#0f172a)] outline-none transition focus:border-[color:var(--pk-primary,#0f766e)] focus:ring-2 focus:ring-[color:var(--pk-primary,#0f766e)]/20"
                  id="portal-signup-last-name"
                  placeholder="Okafor"
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]"
                htmlFor="portal-signup-email"
              >
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)] px-4 py-3 text-sm text-[color:var(--pk-foreground,#0f172a)] outline-none transition focus:border-[color:var(--pk-primary,#0f766e)] focus:ring-2 focus:ring-[color:var(--pk-primary,#0f766e)]/20"
                id="portal-signup-email"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]"
                htmlFor="portal-signup-password"
              >
                Password
              </label>
              <input
                className="w-full rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#f8fafc)] px-4 py-3 text-sm text-[color:var(--pk-foreground,#0f172a)] outline-none transition focus:border-[color:var(--pk-primary,#0f766e)] focus:ring-2 focus:ring-[color:var(--pk-primary,#0f766e)]/20"
                id="portal-signup-password"
                placeholder="Create a password"
                type="password"
              />
            </div>
            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--pk-primary,#0f766e)] px-4 py-3 text-sm font-semibold text-[color:var(--pk-primary-foreground,#ffffff)] shadow-sm transition hover:opacity-95"
              type="button"
            >
              Create portal account
            </button>
          </form>
        </PortalCard>

        <PortalCard title="What happens next">
          <div className="space-y-4 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            <p>
              This route foundation creates the shared branded sign-up
              experience. Customer identity, verification, and saved/offers data
              wiring are layered on in the next portal phases.
            </p>
            <p>
              Already have an account?{" "}
              <Link
                className="font-medium text-[color:var(--pk-primary,#0f766e)] underline-offset-4 hover:underline"
                href="/portal/login"
              >
                Sign in here
              </Link>
              .
            </p>
          </div>
        </PortalCard>
      </div>
    </PortalPage>
  );
}
