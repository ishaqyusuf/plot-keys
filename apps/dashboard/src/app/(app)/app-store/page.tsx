import { createPrismaClient } from "@plotkeys/db";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import {
  BarChart3,
  Calendar,
  ExternalLink,
  MessageCircle,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";
import { requireOnboardedSession } from "../../../lib/session";

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
    icon: BarChart3,
    category: "Analytics",
    configField: "googleAnalyticsId",
    docsUrl: "https://support.google.com/analytics/answer/9304153",
  },
  {
    key: "facebook-pixel",
    name: "Facebook Pixel",
    description:
      "Measure ad conversions, build audiences, and retarget visitors who interact with your site.",
    icon: Target,
    category: "Marketing",
    configField: "facebookPixelId",
    docsUrl: "https://www.facebook.com/business/help/952192354843755",
  },
  {
    key: "whatsapp",
    name: "WhatsApp Business",
    description:
      "Let website visitors message you directly on WhatsApp with a single click.",
    icon: MessageCircle,
    category: "Communication",
    configField: "whatsappPhone",
    docsUrl: "https://business.whatsapp.com/",
  },
  {
    key: "calendly",
    name: "Calendly",
    description:
      "Sync appointment scheduling with your Calendly page so visitors can book viewings.",
    icon: Calendar,
    category: "Scheduling",
    configField: "calendlyUrl",
    docsUrl: "https://calendly.com/",
  },
];

export default async function AppStorePage() {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;

  const prisma = createPrismaClient().db;

  const integration = prisma
    ? await prisma.companyIntegration.findUnique({
        where: { companyId },
      })
    : null;

  const connectedCount = integrations.filter(
    (i) => integration?.[i.configField],
  ).length;

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">App Store</h1>
          <p className="mt-2 text-muted-foreground">
            Connect third-party services to your website and dashboard.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Badge variant="secondary">
              {connectedCount} of {integrations.length} connected
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings/integrations">
                <Settings className="mr-1.5 size-3.5" />
                Configure credentials
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
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
                    <Badge
                      variant={isConnected ? "default" : "outline"}
                    >
                      {isConnected ? "Connected" : "Not connected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {app.description}
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant={isConnected ? "outline" : "default"}>
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
                        <ExternalLink className="mr-1 size-3" />
                        Docs
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
