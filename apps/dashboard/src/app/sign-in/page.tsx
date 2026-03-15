import { authRoutes } from "@plotkeys/auth";
import { SignInForm } from "../../components/auth/sign-in-form";
import { FlowShell } from "../../components/flow-shell";
import { getCurrentAppSession } from "../../lib/session";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getCurrentAppSession();

  if (session) {
    return (
      <meta content={`0;url=${authRoutes.dashboardHome}`} httpEquiv="refresh" />
    );
  }

  const params = (await searchParams) ?? {};

  return (
    <FlowShell
      badge="Access existing workspace"
      description="Successful sign-in now checks the stored user record, validates the password hash, and routes back into the active tenant journey."
      sidePanel={
        <>
          <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
            Planned redirect logic
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Verified but not onboarded -> /onboarding",
              "Verified and onboarded -> /",
              "Published site and builder remain tied to the active company",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[calc(var(--radius-md)-0.1rem)] border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-4 text-sm leading-7 text-primary-foreground/85"
              >
                {item}
              </div>
            ))}
          </div>
        </>
      }
      title="Sign back in and continue where the tenant left off."
    >
      <SignInForm initialError={params.error} />
    </FlowShell>
  );
}
