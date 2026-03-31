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
import { Input } from "@plotkeys/ui/input";
import {
  isVercelDomainProvisioningConfigured,
  SUPPORTED_TLDS,
} from "@plotkeys/utils";
import Link from "next/link";
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
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Connect Custom Domain
            </h1>
            <p className="mt-2 text-muted-foreground">
              Point your own domain to your PlotKeys website.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/domains">← Domains</Link>
          </Button>
        </div>

        {params.error ? (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {/* Connect form */}
        <Card className="mb-6 bg-card">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base">Enter your domain</CardTitle>
            <CardDescription>
              Enter the domain you already own. We support all TLDs including{" "}
              {SUPPORTED_TLDS.nigeria.join(", ")}.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form action={connectCustomDomainAction} className="space-y-4">
              <div>
                <Input
                  name="hostname"
                  placeholder="example.com or example.com.ng"
                  required
                  minLength={4}
                  maxLength={253}
                  autoFocus
                  className="text-base"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Enter the full domain name without http:// or www. For
                  example: <code>myrealestate.com.ng</code> or{" "}
                  <code>luxuryproperties.com</code>
                </p>
              </div>
              <Button type="submit" disabled={!vercelReady}>
                Connect Domain
              </Button>
              {!vercelReady && (
                <p className="text-xs text-muted-foreground">
                  Vercel integration must be configured before connecting
                  domains.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* DNS instructions guide */}
        <Card className="bg-card">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base">How custom domains work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                1. Enter your domain above
              </p>
              <p>
                We&apos;ll register it with our hosting provider (Vercel) and
                give you DNS records to configure.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                2. Configure DNS at your domain provider
              </p>
              <p>
                Log in to your domain provider (e.g. your .com.ng registrar,
                GoDaddy, Namecheap) and add the DNS records we provide.
              </p>
              <div className="rounded-md border bg-muted/50 p-3 text-xs">
                <p className="font-medium text-foreground">
                  For root domains (example.com):
                </p>
                <p>
                  Add an <Badge variant="outline">A</Badge> record pointing to{" "}
                  <code>76.76.21.21</code>
                </p>
                <p className="mt-2 font-medium text-foreground">
                  For subdomains (www.example.com):
                </p>
                <p>
                  Add a <Badge variant="outline">CNAME</Badge> record pointing
                  to <code>cname.vercel-dns.com</code>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                3. Wait for verification
              </p>
              <p>
                DNS changes typically propagate within a few minutes, but can
                take up to 48 hours. We&apos;ll automatically verify and
                activate your domain once the records are configured.
              </p>
            </div>

            <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3">
              <p className="font-medium text-foreground">🇳🇬 .com.ng domains</p>
              <p className="mt-1">
                Nigerian domains (.com.ng, .ng, .org.ng, .net.ng) work the same
                way. Configure DNS records at your Nigerian domain registrar
                (e.g. NiRA-accredited registrar, QServers, Whogohost,
                Web4Africa) following the instructions above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
