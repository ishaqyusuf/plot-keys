"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Estate = RouterOutputs["estates"]["list"][number];

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
    <article className="border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-medium text-foreground">
            {estate.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {estate.location ?? "No location"}
          </p>
        </div>
        <Badge variant={getEstatePublishVariant(estate.publishState)}>
          {estate.publishState}
        </Badge>
      </div>

      <div className="mt-5 space-y-5">
        {estate.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {estate.description}
          </p>
        ) : null}

        <EstateInventoryCells estate={estate} />

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Created {formatEstateDate(estate.createdAt)}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/estates/${estate.slug}`}>Open</Link>
          </Button>
        </div>
      </div>
    </article>
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

function EstateMetricCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-card p-3">
      <p className="font-medium text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
