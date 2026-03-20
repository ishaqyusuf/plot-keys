import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import Link from "next/link";
import { requireOnboardedSession } from "../../lib/session";
import { LogoUpload } from "../../components/settings/logo-upload";
import { setCompanyLogoAction } from "../actions";

function readPublicSupabaseEnvSafe() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export default async function SettingsPage() {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;
  const supabaseEnv = readPublicSupabaseEnvSafe();

  const company = prisma
    ? await prisma.company.findUnique({
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
        where: { id: session.activeMembership.companyId },
      })
    : null;

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="ghost">
              <Link href="/">← Dashboard</Link>
            </Button>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your company profile and branding.
          </p>
        </div>

        {/* Company info */}
        <Card className="mb-6 bg-card">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg">Company</CardTitle>
            <CardDescription>
              Your company details as configured during onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-6">
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Name
              </p>
              <p className="text-sm font-medium text-foreground">
                {company?.name ?? session.activeMembership.companyName}
              </p>
            </div>
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Subdomain
              </p>
              <p className="text-sm font-medium text-foreground">
                {company?.slug ?? session.activeMembership.companySlug}
                .plotkeys.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logo upload */}
        <Card className="mb-6 bg-card">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg">Logo</CardTitle>
            <CardDescription>
              Upload your company logo or provide a URL. This will be displayed on
              your website header and footer.
            </CardDescription>
            {!supabaseEnv ? (
              <p className="mt-2 text-xs text-muted-foreground">
                File upload requires Supabase storage configuration. You can still
                paste a logo URL.
              </p>
            ) : null}
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <LogoUpload
              companyId={session.activeMembership.companyId}
              currentLogoUrl={company?.logoUrl ?? null}
              onSave={setCompanyLogoAction}
              supabaseEnv={supabaseEnv}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
