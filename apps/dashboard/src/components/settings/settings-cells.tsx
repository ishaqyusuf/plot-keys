"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import type { ReactNode } from "react";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CompanySettings = NonNullable<RouterOutputs["team"]["current"]>;

export function SettingsReadOnlyField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

export function SettingsPlanCell({ company }: { company: CompanySettings }) {
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
          <Button variant="outline" size="sm" asChild>
            <Link href="/billing">Upgrade plan</Link>
          </Button>
        ) : null}
      </span>
    </SettingsReadOnlyField>
  );
}

export function SettingsDangerAction() {
  return (
    <Button
      variant="destructive"
      className="hover:bg-destructive text-muted"
      disabled
    >
      Delete
    </Button>
  );
}
