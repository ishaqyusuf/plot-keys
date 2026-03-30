import "@plotkeys/ui/globals.css";

import { createPrismaClient, resolveTenantByHostname } from "@plotkeys/db";
import { NotificationsProvider } from "@plotkeys/notifications-react";
import { ThemeProvider } from "@plotkeys/ui/theme-provider";
import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { ChatWidget } from "../components/chat-widget";
import { IntegrationScripts } from "../components/integration-scripts";
import { RegisterFooter } from "../components/register-footer";
import { RegisterNav } from "../components/register-nav";
import { TenantInteractionShell } from "../components/tenant-interaction-shell";
import { resolveTenantShell } from "../lib/resolve-tenant";

const fallbackMetadata: Metadata = {
  title: "PlotKeys",
  description: "Browse properties, meet agents, and schedule viewings.",
};

async function resolveSubdomain(): Promise<string | null> {
  const requestHeaders = await headers();
  return requestHeaders.get("x-tenant-subdomain") || null;
}

async function resolveIntegrations(subdomain: string | null): Promise<{
  googleAnalyticsId?: string | null;
  facebookPixelId?: string | null;
}> {
  if (!subdomain) return {};
  const prisma = createPrismaClient().db;
  if (!prisma) return {};

  const company = await prisma.company.findFirst({
    where: { slug: subdomain, deletedAt: null },
    select: {
      integration: {
        select: { googleAnalyticsId: true, facebookPixelId: true },
      },
    },
  });

  return {
    googleAnalyticsId: company?.integration?.googleAnalyticsId,
    facebookPixelId: company?.integration?.facebookPixelId,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const prisma = createPrismaClient().db;

  if (!prisma) return fallbackMetadata;

  const tenantHostname = requestHeaders.get("x-tenant-hostname") || null;
  const tenantSubdomain = requestHeaders.get("x-tenant-subdomain") || null;

  let company: {
    name: string;
    market: string | null;
    logoUrl: string | null;
    slug: string;
  } | null = null;

  if (tenantHostname) {
    const resolved = await resolveTenantByHostname(prisma, tenantHostname);
    if (resolved) {
      company = await prisma.company.findFirst({
        where: { id: resolved.companyId, deletedAt: null },
        select: { name: true, market: true, logoUrl: true, slug: true },
      });
    }
  }

  if (!company && tenantSubdomain) {
    company = await prisma.company.findFirst({
      where: { slug: tenantSubdomain, deletedAt: null },
      select: { name: true, market: true, logoUrl: true, slug: true },
    });
  }

  if (!company) return fallbackMetadata;

  const title = company.name;
  const description = company.market
    ? `${company.name} — Real estate in ${company.market}. Browse properties, meet agents, and schedule viewings.`
    : `${company.name} — Browse properties, meet agents, and schedule viewings.`;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: company.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (company.logoUrl) {
    metadata.openGraph!.images = [{ url: company.logoUrl, alt: company.name }];
    metadata.twitter!.images = [company.logoUrl];
    metadata.icons = { icon: company.logoUrl };
  }

  return metadata;
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [subdomain, integrations, shell] = await Promise.all([
    resolveSubdomain(),
    resolveSubdomain().then(resolveIntegrations),
    resolveTenantShell(),
  ]);

  // Determine if this is a register template with family nav/footer
  const hasRegisterShell = shell !== null && shell.familyKey !== undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <NotificationsProvider>
            <TenantInteractionShell
              colorSystemKey={shell?.templateConfig.colorSystem}
              templateConfig={shell?.templateConfig ?? {}}
            >
              {hasRegisterShell && shell.familyKey && shell.tier ? (
                <RegisterNav
                  companyName={shell.company.name}
                  familyKey={shell.familyKey}
                  logoUrl={shell.company.logoUrl}
                  templateKey={shell.templateKey}
                  tier={shell.tier}
                />
              ) : null}

              <main>{children}</main>

              {hasRegisterShell && shell.familyKey ? (
                <RegisterFooter
                  companyName={shell.company.name}
                  familyKey={shell.familyKey}
                />
              ) : null}
            </TenantInteractionShell>
          </NotificationsProvider>

          {subdomain && <ChatWidget subdomain={subdomain} />}
          <IntegrationScripts
            googleAnalyticsId={integrations.googleAnalyticsId}
            facebookPixelId={integrations.facebookPixelId}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
