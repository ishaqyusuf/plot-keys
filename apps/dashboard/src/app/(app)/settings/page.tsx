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
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { Settings2 } from "lucide-react";
import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "../../../components/dashboard/dashboard-page";
import { LogoUploadForm } from "../../../components/settings/logo-upload-form";
import { requireOnboardedSession } from "../../../lib/session";
import { updateCompanyProfileAction } from "../../actions";

type SettingsPageProps = {
  searchParams?: Promise<{ error?: string; saved?: string }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
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
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Settings saved.</AlertDescription>
          </Alert>
        ) : null}

        <DashboardPageHeader>
          <DashboardPageHeaderRow>
            <DashboardPageIntro>
              <DashboardPageEyebrow>Workspace control</DashboardPageEyebrow>
              <DashboardPageTitle>Settings</DashboardPageTitle>
              <DashboardPageDescription>
                Manage workspace identity, branding, notification controls, and
                plan details through a calmer settings system.
              </DashboardPageDescription>
            </DashboardPageIntro>
            <DashboardPageActions>
              <Button asChild variant="outline" size="sm">
                <Link href="/billing">View billing</Link>
              </Button>
            </DashboardPageActions>
          </DashboardPageHeaderRow>
        </DashboardPageHeader>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Company profile</DashboardSectionTitle>
              <DashboardSectionDescription>
                Update company identity and market information used across the
                workspace and public-facing site.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
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
                    <label
                      htmlFor="company-name"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Company name
                    </label>
                    <input
                      id="company-name"
                      name="name"
                      defaultValue={company?.name ?? ""}
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g. Greenfield Realty"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="company-market"
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      Primary market
                    </label>
                    <input
                      id="company-market"
                      name="market"
                      defaultValue={company?.market ?? ""}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g. Lagos, Abuja, Port Harcourt"
                    />
                  </div>
                  <SubmitButton size="sm" loadingLabel="Saving…">
                    Save profile
                  </SubmitButton>
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
        </DashboardSection>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Workspace</DashboardSectionTitle>
              <DashboardSectionDescription>
                Review subdomain, plan level, and current billing status.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
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
        </DashboardSection>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Branding</DashboardSectionTitle>
              <DashboardSectionDescription>
                Keep your logo and workspace presentation aligned across all
                dashboard and site surfaces.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
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
        </DashboardSection>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Workspace controls</DashboardSectionTitle>
              <DashboardSectionDescription>
                Jump into connected settings modules for notifications and
                integrations.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>
          <Card className="border-border/70 bg-card/82">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>
                Choose which events trigger in-app and email notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Button asChild size="sm" variant="outline">
                <Link href="/settings/notifications">
                  Manage notification preferences
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/82">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect Google Analytics, Facebook Pixel, WhatsApp, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Button asChild size="sm" variant="outline">
                <Link href="/settings/integrations">Manage integrations</Link>
              </Button>
            </CardContent>
          </Card>
        </DashboardSection>

        {canEdit ? (
          <DashboardSection>
            <DashboardSectionHeader>
              <div>
                <DashboardSectionTitle>Danger zone</DashboardSectionTitle>
                <DashboardSectionDescription>
                  Restricted actions that should stay visually isolated from
                  normal workflow controls.
                </DashboardSectionDescription>
              </div>
            </DashboardSectionHeader>
            <Card className="border-destructive/30 bg-card/82">
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
                      Permanently delete your workspace and all data. This
                      cannot be undone.
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
          </DashboardSection>
        ) : !company ? (
          <DashboardEmptyState
            description="Workspace settings could not be loaded."
            icon={<Settings2 className="size-5" />}
            title="Settings unavailable"
          />
        ) : null}
      </div>
    </DashboardPage>
  );
}
