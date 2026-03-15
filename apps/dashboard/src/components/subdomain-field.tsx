"use client";

import { Card, CardContent } from "@plotkeys/ui/card";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { useId, useState } from "react";

const plotkeysRootDomain = "plotkeys.com";
const dashboardLabel = "dashboard";

type SubdomainFieldProps = {
  defaultValue?: string;
  description?: string;
  id?: string;
  name?: string;
};

function normalizePreviewValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SubdomainField({
  defaultValue = "",
  description = "Choose the tenant name that appears before .plotkeys.com.",
  id,
  name = "subdomain",
}: SubdomainFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [subdomain, setSubdomain] = useState(defaultValue);
  const previewValue = normalizePreviewValue(subdomain) || "your-brand";
  const websiteHostname = `${previewValue}.${plotkeysRootDomain}`;
  const dashboardHostname = `${dashboardLabel}.${previewValue}.${plotkeysRootDomain}`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>Subdomain</Label>
      <div className="flex items-center overflow-hidden rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-white shadow-sm focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-[color:var(--ring)]">
        <Input
          className="rounded-none border-none shadow-none focus-visible:ring-0"
          defaultValue={defaultValue}
          id={inputId}
          name={name}
          onChange={(event) => setSubdomain(event.target.value)}
          placeholder="astergrove"
          required
        />
        <span className="border-l border-[color:var(--border)] px-4 py-3 text-sm text-slate-500">
          .{plotkeysRootDomain}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-500">{description}</p>
      <Card className="bg-slate-50">
        <CardContent className="space-y-1 px-4 py-3 text-sm text-slate-600">
          <p>
            Website: <strong>{websiteHostname}</strong>
          </p>
          <p>
            Dashboard: <strong>{dashboardHostname}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
