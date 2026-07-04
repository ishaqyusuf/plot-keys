"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Estate = RouterOutputs["workspace"]["listEstates"][number];

const publishVariant: Record<string, "default" | "outline" | "secondary"> = {
  archived: "secondary",
  draft: "outline",
  published: "default",
};

export function getEstatePublishVariant(publishState: string) {
  return publishVariant[publishState] ?? "outline";
}

export function formatEstateDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function EstateLaunchCard({ estate }: { estate: Estate }) {
  return (
    <Card className="border-border/70 bg-card/82">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{estate.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {estate.location ?? "No location"}
            </p>
          </div>
          <Badge variant={getEstatePublishVariant(estate.publishState)}>
            {estate.publishState}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {estate.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {estate.description}
          </p>
        ) : null}

        <EstateInventoryCells estate={estate} />

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">
            Created {formatEstateDate(estate.createdAt)}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/estates/${estate.slug}`}>Open</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EstateInventoryCells({ estate }: { estate: Estate }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <EstateMetricCell label="mapped plots" value={estate._count.plots} />
      <EstateMetricCell label="listings" value={estate._count.properties} />
    </div>
  );
}

function EstateMetricCell({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 p-3">
      <p className="font-medium text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
