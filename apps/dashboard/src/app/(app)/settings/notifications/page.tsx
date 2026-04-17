import { createPrismaClient } from "@plotkeys/db";
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
import { BellRing, Inbox, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
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
  DashboardStatGrid,
} from "../../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../../lib/session";
import { updateNotificationPreferenceAction } from "../../../actions";

const notificationTypes = [
  {
    type: "new_lead_captured",
    label: "New lead captured",
    description: "When a visitor submits a contact form on your website.",
  },
  {
    type: "site_published",
    label: "Site published",
    description: "When your website is published or updated.",
  },
  {
    type: "signup_successful",
    label: "Sign-up confirmation",
    description: "When your account is first created.",
  },
  {
    type: "onboarding_reminder",
    label: "Onboarding reminder",
    description: "Reminders to complete your workspace setup.",
  },
  {
    type: "site_configuration_saved",
    label: "Site configuration saved",
    description: "When changes are saved to your site builder.",
  },
  {
    type: "subscriber_lead_created",
    label: "Newsletter subscriber",
    description: "When a visitor subscribes to your newsletter.",
  },
] as const;

type NotificationPreferencesPageProps = {
  searchParams?: Promise<{ saved?: string }>;
};

export default async function NotificationPreferencesPage({
  searchParams,
}: NotificationPreferencesPageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const userId = session.user.id;
  const params = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;
  const preferences = prisma
    ? await prisma.notificationPreference.findMany({
        where: { companyId, userId },
      })
    : [];

  const prefMap = new Map(
    preferences.map((p) => [p.type, { inApp: p.inApp, email: p.email }]),
  );

  const enabledInApp = preferences.filter((p) => p.inApp).length;
  const enabledEmail = preferences.filter((p) => p.email).length;

  return (
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {params.saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Notification preferences saved.</AlertDescription>
          </Alert>
        ) : null}

        <DashboardPageHeader>
          <DashboardPageHeaderRow>
            <DashboardPageIntro>
              <DashboardPageEyebrow>Settings module</DashboardPageEyebrow>
              <DashboardPageTitle>Notification Preferences</DashboardPageTitle>
              <DashboardPageDescription>
                Keep alerts calm and intentional across the dashboard by
                choosing which events deserve in-app or email delivery.
              </DashboardPageDescription>
            </DashboardPageIntro>
            <DashboardPageActions>
              <Button asChild size="sm" variant="outline">
                <Link href="/settings">Back to settings</Link>
              </Button>
            </DashboardPageActions>
          </DashboardPageHeaderRow>
        </DashboardPageHeader>

        <DashboardStatGrid className="xl:grid-cols-3">
          {[
            {
              icon: BellRing,
              label: "Tracked events",
              value: notificationTypes.length,
            },
            {
              icon: Inbox,
              label: "In-app enabled",
              value: enabledInApp,
            },
            {
              icon: Mail,
              label: "Email enabled",
              value: enabledEmail,
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/65 bg-card/78">
              <CardContent className="flex items-center gap-4 px-5 py-5">
                <div className="rounded-full border border-border/60 bg-background/70 p-3">
                  <stat.icon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </DashboardStatGrid>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Event routing</DashboardSectionTitle>
              <DashboardSectionDescription>
                Toggle delivery by channel for each important system event.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          <Card className="border-border/65 bg-card/78">
            <CardHeader className="px-5 py-4">
              <CardTitle>Event notifications</CardTitle>
              <CardDescription>
                Each toggle updates immediately and follows the shared Midday
                control styling for calmer settings management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 px-5 pb-5 pt-0">
              {notificationTypes.map((nt) => {
                const pref = prefMap.get(nt.type) ?? {
                  inApp: true,
                  email: true,
                };

                return (
                  <div
                    key={nt.type}
                    className="flex flex-col gap-4 rounded-[calc(var(--radius-lg)+0.125rem)] border border-border/60 bg-background/55 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {nt.label}
                        </p>
                        <Badge variant="outline" className="text-[11px]">
                          {nt.type.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {nt.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <form action={updateNotificationPreferenceAction}>
                        <input type="hidden" name="type" value={nt.type} />
                        <input type="hidden" name="channel" value="inApp" />
                        <input
                          type="hidden"
                          name="enabled"
                          value={pref.inApp ? "false" : "true"}
                        />
                        <input
                          type="hidden"
                          name="currentInApp"
                          value={String(pref.inApp)}
                        />
                        <input
                          type="hidden"
                          name="currentEmail"
                          value={String(pref.email)}
                        />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            pref.inApp
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-border/60 bg-background/80 text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <Inbox className="size-3.5" />
                          In-app
                        </button>
                      </form>

                      <form action={updateNotificationPreferenceAction}>
                        <input type="hidden" name="type" value={nt.type} />
                        <input type="hidden" name="channel" value="email" />
                        <input
                          type="hidden"
                          name="enabled"
                          value={pref.email ? "false" : "true"}
                        />
                        <input
                          type="hidden"
                          name="currentInApp"
                          value={String(pref.inApp)}
                        />
                        <input
                          type="hidden"
                          name="currentEmail"
                          value={String(pref.email)}
                        />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            pref.email
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-border/60 bg-background/80 text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          <Mail className="size-3.5" />
                          Email
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </DashboardSection>

        <Card className="border-border/70 bg-card/82">
          <CardContent className="flex items-start gap-3 px-5 py-5">
            <div className="rounded-full border border-border/70 bg-background/80 p-2.5">
              <Sparkles className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Midday direction</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Notification controls now live in the same quieter surface,
                spacing, and token system as the rest of the redesigned
                dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  );
}
