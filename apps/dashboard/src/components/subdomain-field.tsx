"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@plotkeys/ui/input-group";
import {
  buildDashboardHostname,
  buildSitefrontHostname,
  plotkeysRootDomain,
} from "@plotkeys/utils";
import type { ComponentProps } from "react";
import { useEffect, useId, useState } from "react";

type Props = {
  defaultValue?: string;
  description?: string;
  id?: string;
  inputProps?: ComponentProps<typeof InputGroupInput>;
  name?: string;
  value?: string;
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
  inputProps,
  name = "subdomain",
  value,
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [subdomain, setSubdomain] = useState(value ?? defaultValue);

  useEffect(() => {
    setSubdomain(value ?? defaultValue);
  }, [defaultValue, value]);

  const previewValue = normalizePreviewValue(subdomain) || "your-brand";
  const websiteHostname = buildSitefrontHostname(previewValue);
  const dashboardHostname = buildDashboardHostname(previewValue);

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={inputId}>Subdomain</FieldLabel>
        <InputGroup>
          <InputGroupInput
            {...inputProps}
            id={inputId}
            name={name}
            onChange={(event) => {
              setSubdomain(event.target.value);
              inputProps?.onChange?.(event);
            }}
            placeholder="astergrove"
            required
            value={subdomain}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.{plotkeysRootDomain}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>{description}</FieldDescription>
      </Field>
      <div className="border border-border bg-card p-4 text-sm">
        <p className="font-medium text-foreground">Hostname preview</p>
        <div className="mt-2 flex flex-col gap-1 text-muted-foreground">
          <p>
            Website: <strong>{websiteHostname}</strong>
          </p>
          <p>
            Dashboard: <strong>{dashboardHostname}</strong>
          </p>
        </div>
      </div>
    </FieldGroup>
  );
}
