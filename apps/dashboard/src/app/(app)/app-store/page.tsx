import { createPrismaClient } from "@plotkeys/db";
import { getInstalledAppKeys } from "@plotkeys/db/queries/company-apps";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Icon } from "@plotkeys/ui/icons";
import Link from "next/link";
import { requireOnboardedSession } from "../../../lib/session";
import { DEFAULT_APP_KEYS, getInstallableApps } from "../../../lib/app-registry";
import { InstallButton } from "./install-button";

type Integration = {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  configField: "googleAnalyticsId" | "facebookPixelId" | "whatsappPhone" | "calendlyUrl";
  docsUrl: string;
};

const integrations: Integration[] = [
  {
    key: "google-analytics",
    name: "Google Analytics",
    description:
      "Track website traffic, visitor behaviour, and conversion events with Google Analytics 4.",
    icon: Icon.Analytics,
    category: "Analytics",
    configField: "googleAnalyticsId",
    docsUrl: "https://support.google.com/analytics/answer/9304153",
  },
  {
    key: "facebook-pixel",
    name: "Facebook Pixel",
    description:
      "Measure ad conversions, build audiences, and retarget visitors who interact with your site.",
    icon: Icon.Target,
    category: "Marketing",
    configField: "facebookPixelId",
    docsUrl: "https://www.facebook.com/business/help/952192354843755",
  },
  {
    key: "whatsapp",
    name: "WhatsApp Business",
    description:
      "Let website visitors message you directly on WhatsApp with a single click.",
    icon: Icon.MessageCircle,
    category: "Communication",
    configField: "whatsappPhone",
    docsUrl: "https://business.whatsapp.com/",
  },
  {
    key: "calendly",
    name: "Calendly",
    description:
      "Sync appointment scheduling with your Calendly page so visitors can book viewings.",
    icon: Icon.Calendar,
    category: "Scheduling",
    configField: "calendlyUrl",
    docsUrl: "https://calendly.com/",
  },
];

export default async function AppStorePage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;

  // Resolve installed workspace app keys with fallback
  let installedAppKeys: string[] = DEFAULT_APP_KEYS;
  if (prisma) {
    try {
      const keys = await getInstalledAppKeys(prisma, companyId);
      if (keys.length > 0) installedAppKeys = keys;
    } catch {
      // Table may not exist yet (pending migration) — fall back to defaults
    }
  }

  // Resolve third-party integration connection states
  const integration = prisma
    ? await prisma.companyIntegration.findUnique({ where: { companyId } })
    : null;

  const connectedCount = integrations.filter(
    (i) => integration?.[i.configField],
  ).length;

  const installableApps = getInstallableApps();

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl space-y-12">

        {/* Workspace Apps */}
        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">App Store</h1>
            <p className="mt-2 text-muted-foreground">
              Install workspace apps to customise your sidebar and keep your
              team focused on what matters.
            </p>
            <div className="mt-3">
              <Badge variant="secondary">
                {installedAppKeys.length} of {installableApps.length} apps
                installed
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {installableApps.map((app) => {
              const isInstalled = installedAppKeys.includes(app.key);

              return (
                <Card key={app.key} className="bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <app.icon className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          {app.requiredPlan ? (
                            <Badge variant="outline" className="mt-0.5 text-xs capitalize">
                              {app.requiredPlan}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      <Badge variant={isInstalled ? "default" : "outline"}>
                        {isInstalled ? "Installed" : "Not installed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {app.description}
                    </CardDescription>
                    <InstallButton appKey={app.key} installed={isInstalled} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Third-party Integrations */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Integrations
            </h2>
            <p className="mt-1 text-muted-foreground">
              Connect third-party services to your website and dashboard.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Badge variant="secondary">
                {connectedCount} of {integrations.length} connected
              </Badge>
              <Button asChild variant="outline" size="sm">
                <Link href="/settings/integrations">
                  <Icon.Settings className="mr-1.5 size-3.5" />
                  Configure credentials
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {integrations.map((app) => {
              const isConnected = Boolean(integration?.[app.configField]);

              return (
                <Card key={app.key} className="bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <app.icon className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {app.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant={isConnected ? "default" : "outline"}>
                        {isConnected ? "Connected" : "Not connected"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {app.description}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant={isConnected ? "outline" : "default"}
                      >
                        <Link href="/settings/integrations">
                          {isConnected ? "Configure" : "Connect"}
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a
                          href={app.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon.ExternalLink className="mr-1 size-3" />
                          Docs
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
