import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { SUPPORTED_TLDS } from "@plotkeys/utils";
import Link from "next/link";
import { DomainSection } from "@/components/domains/domain-section";
import { ConnectDomainForm } from "@/components/forms/connect-domain-form";

type Props = {
  vercelReady: boolean;
};

const setupSteps: Array<{
  body: string;
  title: string;
}> = [
  {
    body: "PlotKeys creates the domain record and prepares verification for your workspace.",
    title: "1. Register the hostname",
  },
  {
    body: "Update the A or CNAME records at your registrar using the instructions we provide next.",
    title: "2. Add DNS records",
  },
  {
    body: "Once DNS propagates, PlotKeys verifies the domain and activates routing automatically.",
    title: "3. Verify and activate",
  },
];

export function ConnectDomainView({ vercelReady }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Infrastructure workspace
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            Connect Custom Domain
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Bring your own hostname into PlotKeys with a guided, calmer DNS
            setup flow that matches the rest of the redesigned dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {vercelReady ? "Vercel ready" : "Provisioning blocked"}
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/domains">Back to domains</Link>
          </Button>
        </div>
      </div>

      <DomainSection
        description="Enter the domain you already own and PlotKeys will prepare the verification flow."
        title="Hostname intake"
      >
        <div className="border bg-background p-5">
          <div className="mb-4">
            <p className="text-base font-medium">Enter your domain</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We support all major TLDs including{" "}
              {SUPPORTED_TLDS.nigeria.join(", ")}.
            </p>
          </div>
          <ConnectDomainForm disabled={!vercelReady} />
        </div>
      </DomainSection>

      <DomainSection
        description="Follow the same three-step flow each time you connect a custom hostname."
        title="How it works"
      >
        <div className="grid gap-2.5 lg:grid-cols-3">
          {setupSteps.map((item) => (
            <div className="border bg-background p-5" key={item.title}>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="border bg-background p-5">
          <div className="space-y-2 text-sm leading-6 text-muted-foreground">
            <p>
              For root domains, add an <Badge variant="outline">A</Badge> record
              pointing to <code>76.76.21.21</code>.
            </p>
            <p>
              For subdomains, add a <Badge variant="outline">CNAME</Badge>{" "}
              record pointing to <code>cname.vercel-dns.com</code>.
            </p>
            <p>
              DNS updates can propagate in minutes, but some providers take up
              to 48 hours.
            </p>
          </div>
        </div>
      </DomainSection>
    </div>
  );
}
