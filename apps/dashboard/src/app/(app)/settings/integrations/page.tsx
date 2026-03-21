import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import Link from "next/link";
import { requireOnboardedSession } from "../../../../lib/session";
import { updateIntegrationsAction } from "../../../actions";

type IntegrationsPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function IntegrationsPage({
  searchParams,
}: IntegrationsPageProps) {
  const session = await requireOnboardedSession();
  const companyId = session.activeMembership.companyId;
  const params = (await searchParams) ?? {};

  const prisma = createPrismaClient().db;

  const integration = prisma
    ? await prisma.companyIntegration.findUnique({
        where: { companyId },
      })
    : null;

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
            <AlertDescription>Integrations saved.</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Integrations
            </h1>
            <p className="mt-2 text-muted-foreground">
              Connect third-party services to your website and dashboard.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/settings">← Settings</Link>
          </Button>
        </div>

        <form action={updateIntegrationsAction}>
          {/* Google Analytics */}
          <Card className="mb-6 bg-card">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle>Google Analytics</CardTitle>
              <CardDescription>
                Track website traffic with Google Analytics. Enter your GA4
                Measurement ID (e.g. G-XXXXXXXXXX).
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Measurement ID
                </label>
                <input
                  name="googleAnalyticsId"
                  defaultValue={integration?.googleAnalyticsId ?? ""}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Facebook Pixel */}
          <Card className="mb-6 bg-card">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle>Facebook Pixel</CardTitle>
              <CardDescription>
                Add your Facebook Pixel ID to track conversions and remarket to
                visitors.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Pixel ID
                </label>
                <input
                  name="facebookPixelId"
                  defaultValue={integration?.facebookPixelId ?? ""}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="123456789012345"
                />
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card className="mb-6 bg-card">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle>WhatsApp Business</CardTitle>
              <CardDescription>
                Connect a WhatsApp phone number. Visitors can reach you directly
                from your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Phone number
                </label>
                <input
                  name="whatsappPhone"
                  defaultValue={integration?.whatsappPhone ?? ""}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Calendly */}
          <Card className="mb-6 bg-card">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle>Calendly</CardTitle>
              <CardDescription>
                Sync appointment scheduling with your Calendly page.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Calendly URL
                </label>
                <input
                  name="calendlyUrl"
                  defaultValue={integration?.calendlyUrl ?? ""}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://calendly.com/your-name"
                />
              </div>
            </CardContent>
          </Card>

          <SubmitButton loadingLabel="Saving…">
            Save integrations
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
