"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import type { inferRouterOutputs } from "@trpc/server";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import {
  integrations,
  type IntegrationCatalogItem,
} from "./catalog";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CompanyIntegration =
  RouterOutputs["workspace"]["getCompanyIntegration"];

type IntegrationCardProps = {
  app: IntegrationCatalogItem;
  integration: CompanyIntegration;
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

export function IntegrationCard({ app, integration }: IntegrationCardProps) {
  const isConnected = isIntegrationConnected(integration, app);

  return (
    <Card className="border-border/70 bg-card/82">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <IntegrationIdentityCell app={app} />
          <IntegrationStatusBadge isConnected={isConnected} />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          {app.description}
        </CardDescription>
        <IntegrationActionsCell app={app} isConnected={isConnected} />
      </CardContent>
    </Card>
  );
}

function IntegrationIdentityCell({ app }: { app: IntegrationCatalogItem }) {
  const Icon = app.icon;

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <CardTitle className="text-base">{app.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{app.category}</p>
      </div>
    </div>
  );
}

function IntegrationStatusBadge({ isConnected }: { isConnected: boolean }) {
  return (
    <Badge variant={isConnected ? "default" : "outline"}>
      {isConnected ? "Connected" : "Not connected"}
    </Badge>
  );
}

function IntegrationActionsCell({
  app,
  isConnected,
}: {
  app: IntegrationCatalogItem;
  isConnected: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant={isConnected ? "outline" : "default"}>
        <Link href="/settings/integrations">
          {isConnected ? "Configure" : "Connect"}
        </Link>
      </Button>
      <Button asChild size="sm" variant="ghost">
        <a href={app.docsUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-1 size-3" />
          Docs
        </a>
      </Button>
    </div>
  );
}
