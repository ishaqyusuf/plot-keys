import { createPrismaClient, findCompanyById } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import Link from "next/link";
import { LogoUploadForm } from "../../../components/settings/logo-upload-form";
import { requireOnboardedSession } from "../../../lib/session";
import { updateCompanyProfileAction } from "../../actions";

type SettingsPageProps = {
  searchParams?: Promise<{ error?: string; saved?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;
  const company = prisma
    ? await findCompanyById(prisma, session.activeMembership.companyId)
    : null;

  const canEdit =
    session.activeMembership.role === "owner" ||
    session.activeMembership.role === "admin";

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.saved ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Settings saved.</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your workspace profile and branding.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/">← Dashboard</Link>
          </Button>
        </div>

        {/* Company Profile */}
        <Card className="mb-6 bg-card">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle>Company profile</CardTitle>
            <CardDescription>
              Update your company name and primary market.
              {!canEdit ? " Only owners and admins can edit this." : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {canEdit ? (
              <form action={updateCompanyProfileAction} className="space-y-4">
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Company name
                  </label>
                  <input
                    name="name"
                    defaultValue={company?.name ?? ""}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. Greenfield Realty"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Primary market
                  </label>
                  <input
                    name="market"
                    defaultValue={company?.market ?? ""}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. Lagos, Abuja, Port Harcourt"
                  />
                </div>
                <Button type="submit" size="sm">
                  Save profile
                </Button>
              </form>
            ) : (
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Company name
                  </p>
                  <p className="font-semibold text-foreground">
                    {session.activeMembership.companyName}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Primary market
                  </p>
                  <p className="font-semibold text-foreground">
                    {company?.market ?? "—"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workspace info (read-only) */}
        <Card className="mb-6 bg-card">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle>Workspace</CardTitle>
            <CardDescription>
              Read-only information about your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-6">
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Subdomain
              </p>
              <p className="font-semibold text-foreground">
                {session.activeMembership.companySlug}
                <span className="font-normal text-muted-foreground">
                  .plotkeys.com
                </span>
              </p>
            </div>
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Plan
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {company?.planTier ?? "starter"}
                </Badge>
                <Badge
                  variant={
                    company?.planStatus === "active" ? "default" : "outline"
                  }
                  className="capitalize"
                >
                  {company?.planStatus ?? "active"}
                </Badge>
                {company?.planTier !== "pro" ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href="/billing">Upgrade plan</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo upload */}
        <Card className="mb-6 bg-card">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle>Company logo</CardTitle>
            <CardDescription>
              Upload your company logo. It will appear in your website header
              and footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <LogoUploadForm currentLogoUrl={company?.logoUrl ?? null} />
          </CardContent>
        </Card>

        {/* Danger zone */}
        {canEdit ? (
          <Card className="border-destructive/30 bg-card">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle className="text-destructive">Danger zone</CardTitle>
              <CardDescription>
                Actions here can have irreversible consequences. Proceed with
                caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Delete workspace
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your workspace and all data. This cannot
                    be undone.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 text-destructive hover:text-destructive"
                  disabled
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
