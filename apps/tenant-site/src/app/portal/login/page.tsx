import { PortalCard, PortalPage } from "../../../components/portal-page";
import { signInCustomerAction } from "../actions";

type PortalLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    redirect?: string;
    savedStatus?: string;
    signedOut?: string;
  }>;
};

export default async function PortalLoginPage({
  searchParams,
}: PortalLoginPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <PortalPage
      description="Sign in as a customer to view saved listings, track offers, and manage payments from one central branded portal."
      eyebrow="Portal access"
      title="Customer login"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <PortalCard title="Sign in">
          <form action={signInCustomerAction} className="space-y-4">
            <input
              name="redirectTo"
              type="hidden"
              value={params.redirect ?? ""}
            />
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
                name="email"
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
                name="password"
                placeholder="Enter your password"
                type="password"
              />
            </div>
            {params.error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {params.error}
              </p>
            ) : null}
            {params.signedOut ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                You have been signed out.
              </p>
            ) : null}
            {params.savedStatus === "sign-in-required" ? (
              <p className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Sign in to save listings to your portal.
              </p>
            ) : null}
            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--pk-primary,#0f766e)] px-4 py-3 text-sm font-semibold text-[color:var(--pk-primary-foreground,#ffffff)] shadow-sm transition hover:opacity-95"
              type="submit"
            >
              Continue to portal
            </button>
          </form>
        </PortalCard>

        <PortalCard title="Portal access">
          <div className="space-y-4 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            <p>
              Customer portal access is now tied to real sign-in. Use the same
              email address your company has on file for you as a customer.
            </p>
            <p>
              New here? Create your account on the sign-up page for this
              tenant portal.
            </p>
            {params.redirect ? (
              <p>
                After sign-in, we will return you to the property or portal
                page you came from.
              </p>
            ) : null}
          </div>
        </PortalCard>
      </div>
    </PortalPage>
  );
}
