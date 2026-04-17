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
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  isVercelDomainProvisioningConfigured,
  SUPPORTED_TLDS,
} from "@plotkeys/utils";
import { Globe, Network, ShieldCheck, Waypoints } from "lucide-react";
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
import { connectCustomDomainAction } from "../../../actions";

type ConnectDomainPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function ConnectDomainPage({
  searchParams,
}: ConnectDomainPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const vercelReady = isVercelDomainProvisioningConfigured();

  return (
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <DashboardPageHeader>
          <DashboardPageHeaderRow>
            <DashboardPageIntro>
              <DashboardPageEyebrow>
                Infrastructure workspace
              </DashboardPageEyebrow>
              <DashboardPageTitle>Connect Custom Domain</DashboardPageTitle>
              <DashboardPageDescription>
                Bring your own hostname into PlotKeys with a guided, calmer DNS
                setup flow that matches the rest of the redesigned dashboard.
              </DashboardPageDescription>
            </DashboardPageIntro>
            <DashboardPageActions>
              <Badge variant={vercelReady ? "default" : "outline"}>
                {vercelReady ? "Vercel ready" : "Provisioning blocked"}
              </Badge>
              <Button asChild size="sm" variant="outline">
                <Link href="/domains">Back to domains</Link>
              </Button>
            </DashboardPageActions>
          </DashboardPageHeaderRow>
        </DashboardPageHeader>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>Hostname intake</DashboardSectionTitle>
              <DashboardSectionDescription>
                Enter the domain you already own and PlotKeys will prepare the
                verification flow.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          <Card className="border-border/65 bg-card/78">
            <CardHeader className="px-5 py-4">
              <CardTitle>Enter your domain</CardTitle>
              <CardDescription>
                We support all major TLDs including{" "}
                {SUPPORTED_TLDS.nigeria.join(", ")}.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <form action={connectCustomDomainAction} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="hostname">Hostname</FieldLabel>
                    <Input
                      id="hostname"
                      name="hostname"
                      placeholder="example.com or example.com.ng"
                      required
                      minLength={4}
                      maxLength={253}
                      autoFocus
                    />
                  </Field>
                </FieldGroup>
                <p className="text-xs leading-5 text-muted-foreground">
                  Enter the full domain name without <code>http://</code> or{" "}
                  <code>www</code>. Example: <code>myrealestate.com.ng</code>.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={!vercelReady}>
                    Connect domain
                  </Button>
                  {!vercelReady ? (
                    <p className="text-xs text-muted-foreground">
                      Vercel integration must be configured before domain
                      provisioning can start.
                    </p>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>
        </DashboardSection>

        <DashboardSection>
          <DashboardSectionHeader>
            <div>
              <DashboardSectionTitle>How it works</DashboardSectionTitle>
              <DashboardSectionDescription>
                Follow the same three-step flow each time you connect a custom
                hostname.
              </DashboardSectionDescription>
            </div>
          </DashboardSectionHeader>

          <div className="grid gap-2.5 lg:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "1. Register the hostname",
                body: "PlotKeys creates the domain record and prepares verification for your workspace.",
              },
              {
                icon: Network,
                title: "2. Add DNS records",
                body: "Update the A or CNAME records at your registrar using the instructions we provide next.",
              },
              {
                icon: ShieldCheck,
                title: "3. Verify and activate",
                body: "Once DNS propagates, PlotKeys verifies the domain and activates routing automatically.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-border/65 bg-card/78">
                <CardContent className="space-y-3 px-5 py-5">
                  <div className="w-fit rounded-full border border-border/60 bg-background/70 p-2.5">
                    <item.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/65 bg-card/78">
            <CardContent className="flex items-start gap-3 px-5 py-5">
              <div className="rounded-full border border-border/60 bg-background/70 p-2.5">
                <Waypoints className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                <p>
                  For root domains, add an <Badge variant="outline">A</Badge>{" "}
                  record pointing to <code>76.76.21.21</code>.
                </p>
                <p>
                  For subdomains, add a <Badge variant="outline">CNAME</Badge>{" "}
                  record pointing to <code>cname.vercel-dns.com</code>.
                </p>
                <p>
                  DNS updates can propagate in minutes, but some providers take
                  up to 48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      </div>
    </DashboardPage>
  );
}
