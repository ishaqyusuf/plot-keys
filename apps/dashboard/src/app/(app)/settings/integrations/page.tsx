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
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { Activity, CalendarDays, MessageSquareMore, Radar } from "lucide-react";
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
} from "../../../../components/dashboard/dashboard-page";
import { requireOnboardedSession } from "../../../../lib/session";
import { updateIntegrationsAction } from "../../../actions";

type IntegrationsPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

const integrationCards = [
  {
    name: "Google Analytics",
    field: "googleAnalyticsId",
    placeholder: "G-XXXXXXXXXX",
    description: "Track website traffic with your GA4 Measurement ID.",
    icon: Activity,
  },
  {
    name: "Facebook Pixel",
    field: "facebookPixelId",
    placeholder: "123456789012345",
    description:
      "Measure conversions and audience performance with a Pixel ID.",
    icon: Radar,
  },
  {
    name: "WhatsApp Business",
    field: "whatsappPhone",
    placeholder: "+234 800 000 0000",
    description:
      "Give visitors a direct messaging route from your public site.",
    icon: MessageSquareMore,
  },
  {
    name: "Calendly",
    field: "calendlyUrl",
    placeholder: "https://calendly.com/your-name",
    description: "Sync appointment scheduling with your public booking flow.",
    icon: CalendarDays,
  },
] as const;

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
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Integrations saved.</AlertDescription>
          </Alert>
        ) : null}

        <DashboardPageHeader>
          <DashboardPageHeaderRow>
            <DashboardPageIntro>
              <DashboardPageEyebrow>Settings module</DashboardPageEyebrow>
              <DashboardPageTitle>Integrations</DashboardPageTitle>
              <DashboardPageDescription>
                Connect analytics, messaging, and scheduling services through
                one consistent settings surface instead of scattered ad hoc
                forms.
              </DashboardPageDescription>
            </DashboardPageIntro>
            <DashboardPageActions>
              <Button asChild size="sm" variant="outline">
                <Link href="/settings">Back to settings</Link>
              </Button>
            </DashboardPageActions>
          </DashboardPageHeaderRow>
        </DashboardPageHeader>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Connected services</DashboardSectionTitle>
              <DashboardSectionDescription>
                Keep operational tools wired into your site and dashboard from
                one quieter Midday-style control panel.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          <form action={updateIntegrationsAction} className="grid gap-2.5">
            {integrationCards.map((item) => (
              <Card key={item.field} className="border-border/65 bg-card/78">
                <CardHeader className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full border border-border/60 bg-background/70 p-2.5">
                      <item.icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor={item.field}>{item.name}</FieldLabel>
                      <Input
                        id={item.field}
                        name={item.field}
                        defaultValue={
                          (integration?.[item.field] as string) ?? ""
                        }
                        placeholder={item.placeholder}
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end">
              <SubmitButton loadingLabel="Saving…">
                Save integrations
              </SubmitButton>
            </div>
          </form>
        </DashboardSection>
      </div>
    </DashboardPage>
  );
}
