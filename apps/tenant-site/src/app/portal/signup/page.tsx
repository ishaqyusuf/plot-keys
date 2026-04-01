import { PortalCard, PortalPage } from "../../../components/portal-page";
import { signUpCustomerAction } from "../actions";

type PortalSignupPageProps = {
  searchParams?: Promise<{
    error?: string;
    redirect?: string;
  }>;
};

export default async function PortalSignupPage({
  searchParams,
}: PortalSignupPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <PortalPage
      description="Create a customer account to save listings, monitor offers, and manage your relationship with this company from one central portal."
      eyebrow="Portal access"
      title="Customer sign up"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <PortalCard title="Create your account">
          <form action={signUpCustomerAction} className="space-y-4">
            <input
              name="redirectTo"
              type="hidden"
              value={params.redirect ?? ""}
            />
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
                  name="firstName"
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
                  name="lastName"
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
                name="email"
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
                name="password"
                placeholder="Create a password"
                type="password"
              />
            </div>
            {params.error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {params.error}
              </p>
            ) : null}
            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--pk-primary,#0f766e)] px-4 py-3 text-sm font-semibold text-[color:var(--pk-primary-foreground,#ffffff)] shadow-sm transition hover:opacity-95"
              type="submit"
            >
              Create portal account
            </button>
          </form>
        </PortalCard>

        <PortalCard title="What happens next">
          <div className="space-y-4 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            <p>
              Your portal account signs you in immediately for this tenant and
              creates a customer record if one does not already exist here.
            </p>
            <p>
              Already have an account? Use the login page instead of creating a
              second account.
            </p>
            {params.redirect ? (
              <p>
                We will return you to the page you started from once your
                account is ready.
              </p>
            ) : null}
          </div>
        </PortalCard>
      </div>
    </PortalPage>
  );
}
