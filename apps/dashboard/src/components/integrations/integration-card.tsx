"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Icon } from "@plotkeys/ui/icons";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";

import {
  type IntegrationCatalogItem,
  integrations,
} from "@/components/integrations/integration-catalog";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CompanyIntegration = RouterOutputs["integrations"]["get"];

type Props = {
  app: IntegrationCatalogItem;
  integration: CompanyIntegration;
};

type IntegrationLogoInput = {
  app: IntegrationCatalogItem;
};

type IntegrationActionsCellInput = {
  app: IntegrationCatalogItem;
  isConnected: boolean;
};

export function isIntegrationConnected(
  integration: CompanyIntegration,
  app: IntegrationCatalogItem,
) {
  return Boolean(integration?.[app.configField]);
}

export function getConnectedIntegrationCount(
  integration: CompanyIntegration,
  items: IntegrationCatalogItem[] = integrations,
) {
  return items.filter((item) => isIntegrationConnected(integration, item))
    .length;
}

export function IntegrationCard({ app, integration }: Props) {
  const isConnected = isIntegrationConnected(integration, app);

  return (
    <Card className="w-full flex flex-col">
      <div className="pt-6 px-6 h-16 flex items-center justify-between">
        <IntegrationLogo app={app} />
        {isConnected ? (
          <div className="rounded-full bg-success/10 px-3 py-1 font-mono text-[10px] text-success">
            Installed
          </div>
        ) : null}
      </div>

      <CardHeader className="pb-0">
        <div className="flex items-center space-x-2 pb-4">
          <CardTitle className="text-md font-medium leading-none p-0 m-0">
            {app.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="text-xs text-muted-foreground pb-4">
        <p>{app.description}</p>
      </CardContent>

      <div className="px-6 pb-6 flex gap-2 mt-auto">
        <IntegrationActionsCell app={app} isConnected={isConnected} />
      </div>
    </Card>
  );
}

function IntegrationLogo({ app }: IntegrationLogoInput) {
  const Icon = app.icon;

  return (
    <div className="flex size-8 items-center justify-center text-primary">
      <Icon className="size-6" />
    </div>
  );
}

function IntegrationActionsCell({
  app,
  isConnected,
}: IntegrationActionsCellInput) {
  return (
    <>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/settings/integrations">
          {isConnected ? "Configure" : "Connect"}
        </Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <a href={app.docsUrl} target="_blank" rel="noopener noreferrer">
          <Icon.ExternalLink className="mr-1 size-3.5" />
          Docs
        </a>
      </Button>
    </>
  );
}
