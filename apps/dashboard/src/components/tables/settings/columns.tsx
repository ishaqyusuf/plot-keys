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
import Link from "next/link";
import type { ReactNode } from "react";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CompanySettings =
  NonNullable<RouterOutputs["workspace"]["getCompanySettings"]>;

export function SettingsReadOnlyField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <div className="font-semibold text-foreground">{children}</div>
    </div>
  );
}

export function SettingsPlanCell({
  company,
}: {
  company: CompanySettings;
}) {
  return (
    <SettingsReadOnlyField label="Plan">
      <span className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="capitalize">
          {company.planTier ?? "starter"}
        </Badge>
        <Badge
          variant={company.planStatus === "active" ? "default" : "outline"}
          className="capitalize"
        >
          {company.planStatus ?? "active"}
        </Badge>
        {company.planTier !== "pro" ? (
          <Button asChild size="sm" variant="outline">
            <Link href="/billing">Upgrade plan</Link>
          </Button>
        ) : null}
      </span>
    </SettingsReadOnlyField>
  );
}

export function SettingsShortcutCard({
  actionLabel,
  description,
  href,
  title,
}: {
  actionLabel: string;
  description: string;
  href: string;
  title: string;
}) {
  return (
    <Card className="border-border/70 bg-card/82">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Button asChild size="sm" variant="outline">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function SettingsDangerAction() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">
          Delete workspace
        </p>
        <p className="text-xs text-muted-foreground">
          Permanently delete your workspace and all data. This cannot be undone.
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="shrink-0 text-destructive hover:text-destructive"
        disabled
      >
        Delete
      </Button>
    </div>
  );
}
