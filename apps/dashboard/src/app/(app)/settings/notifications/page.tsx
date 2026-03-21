import { createPrismaClient } from "@plotkeys/db";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import Link from "next/link";
import { requireOnboardedSession } from "../../../../lib/session";
import { updateNotificationPreferenceAction } from "../../../actions";

/**
 * All notification types the user can configure, with human-readable labels
 * and descriptions.
 */
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

  // Build a map of type → { inApp, email }
  const prefMap = new Map(
    preferences.map((p) => [p.type, { inApp: p.inApp, email: p.email }]),
  );

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        {params.saved ? (
          <Alert className="mb-6 border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Notification preferences saved.</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Notification Preferences
            </h1>
            <p className="mt-2 text-muted-foreground">
              Choose how you want to be notified for each event.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/settings">← Settings</Link>
          </Button>
        </div>

        <Card className="bg-card">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle>Event Notifications</CardTitle>
            <CardDescription>
              Toggle in-app and email notifications for each event type.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-0 divide-y">
              {notificationTypes.map((nt) => {
                const pref = prefMap.get(nt.type) ?? {
                  inApp: true,
                  email: true,
                };
                return (
                  <div
                    key={nt.type}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {nt.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {nt.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {/* In-app toggle */}
                      <form action={updateNotificationPreferenceAction}>
                        <input type="hidden" name="type" value={nt.type} />
                        <input
                          type="hidden"
                          name="channel"
                          value="inApp"
                        />
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
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            pref.inApp
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                          title={
                            pref.inApp
                              ? "In-app notifications enabled – click to disable"
                              : "In-app notifications disabled – click to enable"
                          }
                        >
                          <span
                            className={`size-1.5 rounded-full ${pref.inApp ? "bg-primary" : "bg-muted-foreground/40"}`}
                          />
                          In-app
                        </button>
                      </form>

                      {/* Email toggle */}
                      <form action={updateNotificationPreferenceAction}>
                        <input type="hidden" name="type" value={nt.type} />
                        <input
                          type="hidden"
                          name="channel"
                          value="email"
                        />
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
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            pref.email
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                          title={
                            pref.email
                              ? "Email notifications enabled – click to disable"
                              : "Email notifications disabled – click to enable"
                          }
                        >
                          <span
                            className={`size-1.5 rounded-full ${pref.email ? "bg-primary" : "bg-muted-foreground/40"}`}
                          />
                          Email
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
