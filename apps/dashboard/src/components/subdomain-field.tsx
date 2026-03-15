"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
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
import type { ComponentProps } from "react";
import { useId, useState } from "react";

const plotkeysRootDomain = "plotkeys.com";
const dashboardLabel = "dashboard";

type SubdomainFieldProps = {
  defaultValue?: string;
  description?: string;
  id?: string;
  inputProps?: ComponentProps<typeof InputGroupInput>;
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
  inputProps,
  name = "subdomain",
}: SubdomainFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [subdomain, setSubdomain] = useState(defaultValue);
  const previewValue = normalizePreviewValue(subdomain) || "your-brand";
  const websiteHostname = `${previewValue}.${plotkeysRootDomain}`;
  const dashboardHostname = `${dashboardLabel}.${previewValue}.${plotkeysRootDomain}`;

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={inputId}>Subdomain</FieldLabel>
        <InputGroup>
          <InputGroupInput
            {...inputProps}
            defaultValue={defaultValue}
            id={inputId}
            name={name}
            onChange={(event) => {
              setSubdomain(event.target.value);
              inputProps?.onChange?.(event);
            }}
            placeholder="astergrove"
            required
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.{plotkeysRootDomain}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>{description}</FieldDescription>
      </Field>
      <Card className="bg-muted/40">
        <CardHeader className="px-4 pt-4 pb-0">
          <CardTitle className="text-sm font-medium text-foreground">
            Hostname preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 px-4 pb-4 text-sm text-muted-foreground">
          <p>
            Website: <strong>{websiteHostname}</strong>
          </p>
          <p>
            Dashboard: <strong>{dashboardHostname}</strong>
          </p>
        </CardContent>
      </Card>
    </FieldGroup>
  );
}
